import { AttributeRes } from '@/app/admin/attributes/columns'
import { Button } from '@/components/ui/Button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { CategoriesRes } from '@/types/Res/Product'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { Form, FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    categoryName: z.string().min(1, { message: "Tên danh mục không được để trống" }),

})

type UpdateCategoryForm = {
    category: CategoriesRes | null,
    onClose: () => void
}
export default function UpdateCategoryForm({ category, onClose }: UpdateCategoryForm) {
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryName: category?.categoryName
        }
    })

    async function obnSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/categories/${category?._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values)
            })
            if (!res.ok) {
                throw new Error("Lỗi cập nhật danh mục")
            }

            const data = await res.json()

            toast({
                title: "Cập nhật danh mục thành công",
                description: "Đã cập nhật danh mục thành công",
                variant: "default",
                duration: 2000,
            })
            onClose()
            window.location.reload()
        } catch (error) {
            console.log("error", error);
            toast({
                title: "Cập nhật danh mục thất bại",
                description: "Có lỗi xảy ra trong quá trình cập nhật danh mục",
                variant: "destructive",
                duration: 2000,
            })
        }
        finally {
            setLoading(false)
        }

    }
    return (
        <FormProvider {...form}>
            <form
                className='w-[500px] space-y-8 mx-auto'
                onSubmit={form.handleSubmit(obnSubmit)}
            >
                <FormField
                    control={form.control}
                    name="categoryName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên danh mục</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Tên danh mục" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    disabled={loading}
                    type='submit' className='w-full' variant="default">
                    {loading ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
            </form>
        </FormProvider>
    )
}

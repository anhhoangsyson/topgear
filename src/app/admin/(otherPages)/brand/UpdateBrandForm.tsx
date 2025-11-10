import { Button } from '@/components/atoms/ui/Button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atoms/ui/form'
import { Input } from '@/components/atoms/ui/input'
import { Textarea } from '@/components/atoms/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { IBrand } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    name: z.string().min(3, { message: "Tên thương hiệu không được để trống" }),
    description: z.string().min(10, { message: "Mô tả không được để trống" }),
})

type UpdateBrandFormProps = {
    brand: Partial<IBrand> | null,
    onClose: () => void,
}
export default function UpdateBrandForm({ brand, onClose }: UpdateBrandFormProps) {

    // router is assigned but not used
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: brand?.name || "",
            description: brand?.description || "",
        }
    })


    useEffect(() => {
        form.reset({
            name: brand?.name || "",
            description: brand?.description || "",
        });
    }, [brand, form]);

    async function obnSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brand/${brand?._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values)
            })
            if (!res.ok) {
                throw new Error("Lỗi cập nhật thuong hiệu")
            }

            await res.json();

            toast({
                title: "Cập nhật thương hiệu thành công",
                variant: "default",
                duration: 2000,
            })

            onClose()
            window.location.reload()
        } catch {
            toast({
                title: "Cập nhật danh mục thất bại",
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
            <h2 className="text-xl font-bold text-gray-800 mb-4" >Cập nhật thương hiệu</h2>
            <form
                className='w-[500px] space-y-8 mx-auto'
                onSubmit={form.handleSubmit(obnSubmit)}
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên thương hiệu</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Tên thương hiệu" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={4}
                                    placeholder="Mô tả ..." {...field} />
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

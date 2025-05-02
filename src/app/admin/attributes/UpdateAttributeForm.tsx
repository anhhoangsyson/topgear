import { AttributeRes } from '@/app/admin/attributes/columns'
import { Button } from '@/components/ui/Button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { Form, FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    attributeName: z.string().min(1, { message: "Tên thuộc tính không được để trống" }),
})

type UpdateAttributeFormProps = {
    attribute: AttributeRes | null,
    onClose: () => void
}
export default function UpdateAttributeForm({ attribute, onClose }: UpdateAttributeFormProps) {
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            attributeName: attribute?.attributeName
        }
    })

    async function obnSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/attribute/${attribute?._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values)
            })
            if (!res.ok) {
                throw new Error("Lỗi cập nhật thuộc tính")
            }

            const data = await res.json()
            console.log("data", data);

            if (data.success) {
                toast({
                    title: "Cập nhật thuộc tính thành công",
                    description: "Đã cập nhật thuộc tính thành công",
                    variant: "default",
                    duration: 2000,
                })
                onClose()
            }
        } catch (error) {
            console.log("error", error);
            toast({
                title: "Cập nhật thuộc tính thất bại",
                description: "Có lỗi xảy ra trong quá trình cập nhật thuộc tính",
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
                    name="attributeName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên thuộc tính</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Tên thuộc tính" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                disabled={loading}
                type='submit' className='w-full' variant="default">
                    { loading ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
            </form>
        </FormProvider>
    )
}

'use client'
import React, { useEffect, useState } from 'react'
import { string, z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialogCustom } from '@/app/admin/components/ui/AlerDialog'
import OverlayLoader from '@/components/OverlayLoader'



const formSchema = z.object({
    name: z.string().min(1, { message: "Tên thuộc tính không được để trống" }),
    logo: z
        .any()
        .refine((file) => file instanceof File || (Array.isArray(file) && file.length > 0), {
            message: "Logo không được để trống",
        }),
    description: z.string().min(1, { message: "Mô tả không được để trống" }),
    country: z.string().min(1, { message: "Quốc gia không được để trống" }),
    website: z.string().min(1, { message: "Website không hợp lệ" })
})


export default function AddBrandForm() {
    const [isLoading, setIsLoading] = useState(false);
    // const [isDialogOpen, setIsDialogOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            logo: "",
            description: "",
            country: "",
            website: "",
        }
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append('name', values.name)
            formData.append('description', values.description)
            formData.append('country', values.country)
            formData.append('website', values?.website)

            if (values.logo instanceof File) {
                formData.append('logo', values.logo)
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brand`, {
                method: 'POST',
                body: formData
            })

            if (!res.ok) {
                const { message } = await res.json()
                toast({
                    title: "Có lỗi xảy ra khi tạo thương hiệu",
                    description: message,
                    variant: "destructive",
                    duration: 2000,
                })
            }

            toast({
                title: "Tạo thương hiệu thành công",
                variant: "default",
                duration: 2000,
            })

            // setIsDialogOpen(true)

        } catch (error) {
            toast({
                title: "Có lỗi xảy ra khi tạo thương hiệu",
                description: "Vui lòng thử lại sau",
                variant: "destructive",
                duration: 2000,
            })
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form
                className='space-y-8 w-full'
                onSubmit={form.handleSubmit(onSubmit)}>
                <h2>
                    <span className='text-2xl font-bold text-gray-800 mb-8'>Tạo thương hiệu</span>
                </h2>

                {/* attributeName */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên thương hiệu</FormLabel>
                            <FormControl>
                                <Input placeholder="Tên thương hiệu" {...field} />
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Desc..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Logo</FormLabel>
                            <FormControl>
                                <Input
                                    accept="image/*"
                                    type='file'
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            field.onChange(e.target.files[0]); // Lưu file vào react-hook-form
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link Website thưong hiệu</FormLabel>
                            <FormControl>
                                <Input placeholder="acer.com.vn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quốc gia</FormLabel>
                            <FormControl>
                                <Input placeholder="UK,.." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* submit button */}
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang tạo..." : "Tạo thương hiệu"}
                </Button>
                {/* {isDialogOpen && (
                    < AlertDialogCustom
                        open={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        title="Thêm thương hiệu thành công"
                        description="Bạn có muốn thêm thương hiệu khác không?"
                        onConfirm={() => {
                            setIsDialogOpen(false)
                            form.reset()
                        }}
                        href="/admin/brand"
                    />
                )} */}

                {isLoading && (<OverlayLoader />)}
            </form>
        </Form>
    )
}

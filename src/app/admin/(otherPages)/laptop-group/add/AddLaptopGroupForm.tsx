'use client'
import React, { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from '@/hooks/use-toast'
import { ILaptop } from '@/types'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atoms/ui/form'
import { Input } from '@/components/atoms/ui/input'
import { Textarea } from '@/components/atoms/ui/textarea'
import MultipleSelector from '@/components/atoms/ui/multiple-selector'
import { Button } from '@/components/atoms/ui/Button'
import OverlayLoader from '@/components/atoms/feedback/OverlayLoader'



const formSchema = z.object({
    name: z.string().min(1, { message: "Tên thuộc tính không được để trống" }),
    description: z.string().min(1, { message: "Mô tả không được để trống" }),
    laptops: z.array(z.string())
        .min(1, { message: "Bạn phải chọn ít nhất một laptop" }),
    sortOrder: z.string().optional(),
    backgroundImage: z.any()
})


export default function AddLaptopGroupForm({ laptops }: { laptops: ILaptop[] }) {


    const [isLoading, setIsLoading] = useState(false);
    // const [isDialogOpen, setIsDialogOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            laptops: [],
            sortOrder: "",
            backgroundImage: null as File | null, // Khởi tạo là null, sẽ được cập nhật khi người dùng chọn file
        }
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append('name', values.name)
            formData.append('description', values.description)
            formData.append('sorOrder', String(values.sortOrder))
            formData.append('laptops', JSON.stringify(values.laptops))

            if (values.backgroundImage instanceof File) {
                formData.append('backgroundImage', values.backgroundImage)
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/laptop-group`, {
                method: 'POST',
                body: formData
            })

            if (!res.ok) {
                const { message } = await res.json()
                toast({
                    title: "Có lỗi xảy ra khi tạo laptop group",
                    description: message,
                    variant: "destructive",
                    duration: 2000,
                })
            }

            toast({
                title: "Tạo laptop group thành công",
                variant: "default",
                duration: 2000,
            })

            // setIsDialogOpen(true)

        } catch {
            toast({
                title: "Có lỗi xảy ra khi tạo laptop group",
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

                {/* group naem */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên Group</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Laptop Acer" {...field} />
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
                    name="backgroundImage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>BackGround Group</FormLabel>
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
                    name="laptops"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Thương hiệu</FormLabel>
                            <FormControl>
                                <MultipleSelector
                                    options={laptops.map((laptop) => ({
                                        label: laptop.name,
                                        value: laptop._id,
                                    }))}
                                    // value={field.value}
                                    // onChange={field.onChange}
                                    value={
                                        laptops
                                            .filter((laptop) => field.value.includes(laptop._id))
                                            .map((laptop) => ({
                                                label: laptop.name,
                                                value: laptop._id,
                                            }))
                                    }
                                    onChange={(selectedOptions) => {
                                        // selectedOptions là Option[]
                                        field.onChange(selectedOptions.map((opt) => opt.value));
                                    }}
                                    placeholder="Chọn laptop"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="sortOrder"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Thu tu</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    placeholder="UK,.."
                                    min={0}
                                    max={100}
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* submit button */}
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang tạo..." : "Tạo laptop group"}
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

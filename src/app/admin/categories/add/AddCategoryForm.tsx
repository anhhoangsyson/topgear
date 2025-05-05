'use client'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import MultipleSelector, { Option } from '@/components/ui/multiple-selector'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/Button'


const formSchema = z.object({
    categoryName: z.string().min(1, { message: "Tên danh mục không được để trống" }),
    parentCategoryId: z.string().min(1, { message: "Danh mục không được để trống" }),
})



export default function AddCategoryForm() {
    const [categories, setCategories] = React.useState<Option[]>([])
    const [loading, setLoading] = React.useState(false);

    const fakeCategories: { _id: string, categoryName: string, parentCategoryId: string | null }[] = [
        { _id: "1", categoryName: "Danh mục cấp 1 - A", parentCategoryId: null },
        { _id: "2", categoryName: "Danh mục cấp 1 - B", parentCategoryId: null },
        { _id: "3", categoryName: "Danh mục cấp 2 - A1", parentCategoryId: "1" },
        { _id: "4", categoryName: "Danh mục cấp 2 - B1", parentCategoryId: "2" },
        { _id: "5", categoryName: "Danh mục cấp 3 - A1-1", parentCategoryId: "3" },
        { _id: "6", categoryName: "Danh mục cấp 3 - B1-1", parentCategoryId: "4" },
    ];

    // Xử lý dữ liệu giả lập
    useEffect(() => {
        const options = fakeCategories.map((cat) => ({
            label: cat.categoryName,
            value: cat._id,
        }));
        setCategories(options);
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryName: "",
            parentCategoryId: "",
        }
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values)
            })

            if (!res.ok) {
                const { message } = await res.json()
                toast({
                    title: "Có lỗi xảy ra khi tạo danh mục",
                    description: message,
                    variant: "destructive",
                    duration: 2000,
                })
            }

            toast({
                title: "Tạo danh mục thành công",
                description: "Bạn đã tạo danh mục thành công",
                variant: "default",
                duration: 2000,
            })

            form.reset()


        } catch (error) {
            console.log('Error creating attribute:', error)
            toast({
                title: "Có lỗi xảy ra khi tạo danh mục",
                description: "Vui lòng thử lại sau",
                variant: "destructive",
                duration: 2000,
            })
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form
                className='space-y-8 w-full'
                onSubmit={form.handleSubmit(onSubmit)}>
                {/* attributeName */}
                <FormField
                    control={form.control}
                    name="categoryName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên danh mục</FormLabel>
                            <FormControl>
                                <Input placeholder="Tên danh mục" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* dropdown category seclect */}
                <FormField
                    control={form.control}
                    name="parentCategoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Danh mục cha</FormLabel>
                            <FormControl>
                                <MultipleSelector
                                    value={categories.filter((item) => field.value === item.value)}
                                    onChange={(selected: Option[]) => {
                                        field.onChange(selected.length > 0 ? selected[0].value : undefined);
                                    }}
                                    options={categories}
                                    placeholder="Chọn danh mục cha..."
                                    emptyIndicator={
                                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                            Không tìm thấy danh mục.
                                        </p>
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* submit button */}
                <Button type="submit" disabled={loading}>
                    {loading ? "Đang tạo..." : "Tạo thuộc tính"}
                </Button>

            </form>
        </Form>
    )
}

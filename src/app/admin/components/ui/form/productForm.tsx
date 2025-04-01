"use client"
import { JSX } from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Loader2 } from "lucide-react"
import { type ICategory, type IProduct, type ProductFormValues, productSchema } from "@/types"
import { getCategories } from "@/services/api"

interface ProductFormProps {
  onSubmit: (data: ProductFormValues) => Promise<void>
  initialData: IProduct | null
  isSubmitting: boolean
}

export default function ProductForm({
  onSubmit,
  initialData = null,
  isSubmitting = false,
}: ProductFormProps): JSX.Element {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          productName: initialData.productName,
          categoriesId: initialData.categoriesId,
        }
      : {
          productName: "",
          categoriesId: "",
        },
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories()
        if (result.success && result.data) {
          setCategories(result.data)
        } else {
          console.error("Lỗi khi lấy danh mục:", result.error)
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (data: ProductFormValues): Promise<void> => {
    await onSubmit(data)
  }

  if (isLoading) {
    return <div className="py-10 text-center">Đang tải dữ liệu...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sản phẩm</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: Laptop Acer Nitro 5" {...field} />
              </FormControl>
              <FormDescription>Nhập tên đầy đủ của sản phẩm</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoriesId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục sản phẩm" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id || ""}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Chọn danh mục phù hợp cho sản phẩm</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              Tiếp theo
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}


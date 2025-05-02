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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

type Category = {
  _id: string;
  categoryName: string;
}

const formSchema = z.object({
  attributeName: z.string().min(1, { message: "Tên thuộc tính không được để trống" }),
  categoryIds: z.array(z.string()).min(1, { message: "Danh mục không được để trống" }),
})


export default function AddAttributeForm({ cats }: { cats: Category[] }) {
  const [categories, setCategories] = React.useState<Option[]>([])
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const categoriesOptions = cats.map((cat: Category) => ({
      label: cat.categoryName,
      value: cat._id
    }))
    setCategories(categoriesOptions)
  }, [cats])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attributeName: "",
      categoryIds: [],
    }
  })


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    try {
      console.log('data attribute create', values)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/attribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      })

      if (!res.ok) {
        const { message } = await res.json()
        toast({
          title: "Có lỗi xảy ra khi tạo thuộc tính",
          description: message,
          variant: "destructive",
          duration: 2000,
        })
      }

      toast({
        title: "Tạo thuộc tính thành công",
        description: "Bạn đã tạo thuộc tính thành công",
        variant: "default",
        duration: 2000,
      })

      form.reset()


    } catch (error) {
      console.log('Error creating attribute:', error)
      toast({
        title: "Có lỗi xảy ra khi tạo thuộc tính",
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
          name="attributeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên thuộc tín</FormLabel>
              <FormControl>
                <Input placeholder="Tên thuộc tính" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* dropdown category seclect */}
        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <FormControl>
                <MultipleSelector
                  value={categories.filter((item) => field.value.includes(item.value))}
                  onChange={(selected: Option[]) => {
                    console.log("Selected categories:", selected);
                    field.onChange(selected.map((option) => option.value))
                  }}
                  options={categories}
                  placeholder="Chọn danh mục..."
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

"use client"

import { useState, useEffect, JSX } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus } from "lucide-react"
import {
  type IAttribute,
  type IProductVariant,
  type IProductAttribute,
  type ProductAttributeFormValues,
  StatusProductVariant,
  productAttributeSchema,
} from "@/types"
import { getAttributesByCategory } from "@/services/api"

interface AttributeFormProps {
  onSubmit: (variantId: string, data: ProductAttributeFormValues) => Promise<void>
  variants: IProductVariant[]
  attributes: Record<string, IProductAttribute[]>
  onNext: () => void
  isSubmitting: boolean
}

export default function AttributeForm({
  onSubmit,
  variants = [],
  attributes = {},
  onNext,
  isSubmitting = false,
}: AttributeFormProps): JSX.Element {
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [attributeList, setAttributeList] = useState<IAttribute[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const form = useForm<ProductAttributeFormValues>({
    resolver: zodResolver(productAttributeSchema),
    defaultValues: {
      attributeId: "",
      attributeValue: "",
      status: StatusProductVariant.ACTIVE,
    },
  })

  useEffect(() => {
    // Tự động chọn biến thể đầu tiên nếu có
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]._id || "")
    }
  }, [variants, selectedVariant])

  useEffect(() => {
    const fetchAttributes = async () => {
      if (!selectedVariant) return

      const selectedVariantData = variants.find((v) => v._id === selectedVariant)
      if (!selectedVariantData) return

      try {
        setIsLoading(true)
        // Lấy danh mục từ sản phẩm của biến thể
        const categoryId = selectedVariantData.productId // Giả sử productId là categoryId
        const result = await getAttributesByCategory(categoryId)

        if (result.success && result.data) {
          setAttributeList(result.data)
        } else {
          console.error("Lỗi khi lấy thuộc tính:", result.error)
        }
      } catch (error) {
        console.error("Lỗi khi lấy thuộc tính:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAttributes()
  }, [selectedVariant, variants])

  const handleSubmit = async (data: ProductAttributeFormValues): Promise<void> => {
    if (!selectedVariant) return

    await onSubmit(selectedVariant, data)

    form.reset({
      ...form.getValues(),
      attributeValue: "",
    })
  }

  if (variants.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">Vui lòng thêm ít nhất một biến thể trước khi thêm thuộc tính.</p>
        <Button onClick={onNext} variant="outline">
          Bỏ qua bước này
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={selectedVariant} onValueChange={setSelectedVariant} className="w-full">
        <TabsList className="w-full justify-start overflow-auto">
          {variants.map((variant) => (
            <TabsTrigger key={variant._id} value={variant._id || ""} className="flex-shrink-0">
              {variant.variantName}
            </TabsTrigger>
          ))}
        </TabsList>

        {variants.map((variant) => (
          <TabsContent key={variant._id} value={variant._id || ""} className="pt-4">
            <div className="space-y-6">
              {isLoading ? (
                <div className="py-4 text-center">Đang tải dữ liệu thuộc tính...</div>
              ) : (
                <>
                  {attributes[variant._id || ""] && attributes[variant._id || ""].length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Thuộc tính đã thêm</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {attributes[variant._id || ""].map((attr) => {
                          const attributeName =
                            attributeList.find((a) => a._id === attr.attributeId)?.attributeName || attr.attributeId

                          return (
                            <Card key={attr._id}>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-base">{attributeName}</CardTitle>
                                  <Badge
                                    variant={attr.status === StatusProductVariant.ACTIVE ? "default" : "secondary"}
                                  >
                                    {attr.status === StatusProductVariant.ACTIVE ? "Hiển thị" : "Ẩn"}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm">{attr.attributeValue}</p>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 border rounded-lg p-4">
                      <h3 className="text-lg font-medium">Thêm thuộc tính mới</h3>

                      <FormField
                        control={form.control}
                        name="attributeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Thuộc tính</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn thuộc tính" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {attributeList.map((attribute) => (
                                  <SelectItem key={attribute._id} value={attribute._id}>
                                    {attribute.attributeName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>Chọn thuộc tính cần thêm</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="attributeValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giá trị</FormLabel>
                            <FormControl>
                              <Input placeholder="Ví dụ: Intel Core i5-12500H" {...field} />
                            </FormControl>
                            <FormDescription>Nhập giá trị của thuộc tính</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trạng thái</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={StatusProductVariant.ACTIVE}>Hiển thị</SelectItem>
                                <SelectItem value={StatusProductVariant.INACTIVE}>Ẩn</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Chọn trạng thái hiển thị của thuộc tính</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" />
                              Thêm thuộc tính
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="pt-4 flex justify-end">
        <Button onClick={onNext} disabled={isSubmitting}>
          Tiếp tục đến hình ảnh
        </Button>
      </div>
    </div>
  )
}


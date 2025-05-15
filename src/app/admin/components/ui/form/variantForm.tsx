"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus } from "lucide-react"
import {
  ICategory,
  type IProductVariant,
  type ProductVariantFormValues,
  StatusProductVariant,
  productVariantSchema,
} from "@/types"
import type { JSX } from "react"

interface VariantFormProps {
  onSubmit: (data: ProductVariantFormValues) => Promise<void>
  productId: string
  variants: IProductVariant[]
  onNext: () => void
  isSubmitting: boolean
}

export default function VariantForm({
  onSubmit,
  productId,
  variants = [],
  onNext,
  isSubmitting = false,
}: VariantFormProps): JSX.Element {

  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [dataFilter, setDataFilter] = useState<ICategory[]>([])
  const form = useForm<ProductVariantFormValues>({
    resolver: zodResolver(productVariantSchema),
    defaultValues: {
      productId: productId,
      variantName: "",
      variantPrice: 0,
      variantPriceSale: 0,
      filterCategories: [],
      variantStock: 0,
      status: StatusProductVariant.ACTIVE,
    },
  })

  const handleSubmit = async (data: ProductVariantFormValues): Promise<void> => {
    console.log("data", data);
    await onSubmit(data)
    form.reset()
    setIsAdding(false)
  }

  const getFilterCategoriesList = async () => {
    // Call API to get product vua moi tao o step 1
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/products/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    console.log('productIdpassed', productId);
    
    console.log('data',data);
    // lay ra cateogriesId cua product vua moi tao o step 1
    const categoryId = data.data.categoriesId
    // goi api lay danh sach cateogires chld cua cateogriesId
    const resFilterData = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/categories/parent/${categoryId}`, {
      method: "GET"
    })
    const dataFilter = await resFilterData.json()
    console.log('dataFilter', dataFilter);
    // console.log(categoryId);

    setDataFilter(dataFilter.data)
  }

  const handleCategoryChange = (parentId: string, value: string) => {
    const currentValues = form.getValues("filterCategories");
    // Lọc bỏ giá trị cũ của cùng danh mục cha (parentId), chỉ giữ giá trị mới
    const newValues = currentValues.filter(cat => !cat.startsWith(parentId));
    if (value) {
      newValues.push(value); // Thêm giá trị mới được chọn
    }
    form.setValue("filterCategories", newValues);
  }

  useEffect(() => {
    getFilterCategoriesList()
  }, [])

  return (
    <div className="space-y-6">
      {/* {variants.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Biến thể đã thêm</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {variants.map((variant) => (
              <Card key={variant._id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{variant.variantName}</CardTitle>
                    <Badge variant={variant.status === StatusProductVariant.ACTIVE ? "default" : "secondary"}>
                      {variant.status === StatusProductVariant.ACTIVE ? "Đang bán" : "Ngừng bán"}
                    </Badge>
                  </div>
                  <CardDescription>ID: {variant._id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Giá: </span>
                      <span className="font-medium">{variant.variantPrice.toLocaleString()} đ</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tồn kho: </span>
                      <span className="font-medium">{variant.variantStock}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )} */}

      {isAdding ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 border rounded-lg p-4">
            <h3 className="text-lg font-medium">Thêm biến thể mới</h3>
            <FormField
              control={form.control}
              name="variantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên biến thể</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Nitro 5 AMD Ryzen 5" {...field} />
                  </FormControl>
                  <FormDescription>Nhập tên biến thể sản phẩm</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="variantPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá bán</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ví dụ: 15000000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Nhập giá bán (VNĐ)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="variantStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ví dụ: 10"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Nhập số lượng tồn kho</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="variantPriceSale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá giảm</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ví dụ: 15000000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Nhập giá sau khi giảm (VNĐ)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />



              {/* <FormField
                control={form.control}
                name="filterCategorires"
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
              /> */}

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {dataFilter.map((parentCategory) => (
                <FormField
                  key={parentCategory._id}
                  control={form.control}
                  name="filterCategories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{parentCategory.categoryName}</FormLabel>
                      <Select
                        onValueChange={(value) => handleCategoryChange(parentCategory._id as string, value)}
                        value={
                          field.value.find(val => val.startsWith(parentCategory._id as string)) || ""
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`Chọn ${parentCategory.categoryName}`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* <SelectItem value="">Không chọn</SelectItem> */}
                          {parentCategory.children?.map((child) => (
                            <SelectItem key={child._id} value={child._id as string}>
                              {child.categoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Chọn một {parentCategory.categoryName.toLowerCase()}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Hiển thị các giá trị đã chọn */}
            <div className="mt-4">
              <h4 className="text-sm font-medium">Thuộc tính đã chọn:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.watch("filterCategories").map((catId) => {
                  const category = dataFilter
                    .flatMap(parent => parent.children)
                    .find(child => child?._id === catId);
                  return category ? (
                    <Badge key={catId} variant="secondary">
                      {category.categoryName}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

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
                      <SelectItem value={StatusProductVariant.ACTIVE}>Đang bán</SelectItem>
                      <SelectItem value={StatusProductVariant.INACTIVE}>Ngừng bán</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Chọn trạng thái của biến thể</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setIsAdding(false)} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>Lưu biến thể</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Button variant="outline" onClick={() => setIsAdding(true)} className="w-full" disabled={isSubmitting}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm biến thể mới
        </Button>
      )}

      {variants.length > 0 && (
        <div className="pt-4 flex justify-end">
          <Button onClick={onNext} disabled={isSubmitting}>
            Tiếp tục đến thuộc tính
          </Button>
        </div>
      )}
    </div>
  )
}


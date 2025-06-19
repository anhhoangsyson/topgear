"use client"

import { JSX, useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { type ProductFormData, StatusProductVariant } from "@/types"
import { Button } from "@/components/atoms/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atoms/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/atoms/ui/accordion"
import { Badge } from "@/components/atoms/ui/badge"

interface ProductSummaryProps {
  productData: ProductFormData
  onSubmit: () => Promise<void>
  isSubmitting: boolean
}

export default function ProductSummary({
  productData,
  onSubmit,
  isSubmitting = false,
}: ProductSummaryProps): JSX.Element {
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const { product, variants, attributes, images } = productData

  const handleSubmit = async (): Promise<void> => {
    try {
      await onSubmit()
      setIsSuccess(true)
    } catch (error) {
      console.error("Error submitting product:", error)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Thêm sản phẩm thành công!</h2>
        <p className="text-muted-foreground mb-6">Sản phẩm của bạn đã được thêm vào hệ thống.</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => (window.location.href = "/products/add")}>
            Thêm sản phẩm khác
          </Button>
          <Button onClick={() => (window.location.href = "/products")}>Xem danh sách sản phẩm</Button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">Vui lòng hoàn thành các bước trước đó.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin sản phẩm</CardTitle>
          <CardDescription>Thông tin cơ bản về sản phẩm</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Tên sản phẩm:</dt>
              <dd className="font-medium">{product.productName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">ID sản phẩm:</dt>
              <dd className="font-medium">{product._id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Danh mục:</dt>
              <dd className="font-medium">{product.categoriesId}</dd>
            </div>
            {product.description && (
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Mô tả:</dt>
                <dd className="font-medium">{product.description}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {variants.length > 0 && (
        <Accordion type="single" collapsible defaultValue="variants">
          <AccordionItem value="variants">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <span>Biến thể sản phẩm</span>
                <Badge variant="outline">{variants.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
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

                      {/* Thuộc tính của biến thể */}
                      {attributes[variant._id || ""] && attributes[variant._id || ""].length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-sm font-medium mb-2">Thuộc tính:</h4>
                          <ul className="text-sm space-y-1">
                            {attributes[variant._id || ""].map((attr) => (
                              <li key={attr._id} className="flex justify-between">
                                <span className="text-muted-foreground">{attr.attributeId}:</span>
                                <span>{attr.attributeValue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Hình ảnh của biến thể */}
                      {images[variant._id || ""] && images[variant._id || ""].length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-sm font-medium mb-2">Hình ảnh:</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {images[variant._id || ""].map((url, index) => (
                              <div key={index} className="aspect-square rounded-md overflow-hidden border">
                                <img
                                  src={url || "/placeholder.svg"}
                                  alt={`Hình ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <CardFooter className="flex justify-end px-0">
        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Hoàn tất thêm sản phẩm"
          )}
        </Button>
      </CardFooter>
    </div>
  )
}


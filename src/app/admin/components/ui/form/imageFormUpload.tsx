"use client"

import type { JSX } from "react"
import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader2, Plus, Upload, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { IProductVariant } from "@/types"
import { uploadImage } from "@/services/api"
import { set } from "zod"

interface ImageUploadFormProps {
  onSubmit: (variantId: string, imageUrl: File) => Promise<void>
  variants: IProductVariant[]
  images: Record<string, string[]>
  onNext: () => void
  isSubmitting: boolean
}

export default function ImageUploadForm({
  onSubmit,
  variants = [],
  images = {},
  onNext,
  isSubmitting = false,
}: ImageUploadFormProps): JSX.Element {
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    // Tự động chọn biến thể đầu tiên nếu có
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]._id || "")
    }
  }, [variants, selectedVariant])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)

    // Tải lên hình ảnh
    setIsUploading(true)
    setError("")  

    // Tạo URL xem trước
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      // Gọi API để tải lên hình ảnh
      // const result = await uploadImage(file)

      // if (result.success && result.data) {
      //   setImageUrl(result.data.imageUrl)
      // } else {
      //   setError(result.error || "Lỗi khi tải lên hình ảnh")
      //   setPreviewUrl("")
      // }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Lỗi khi tải lên hình ảnh")
      setPreviewUrl("")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // if (!imageUrl) {
    //   setError("Vui lòng tải lên hình ảnh trước")
    //   return
    // }

    if (!selectedVariant) {
      setError("Vui lòng chọn biến thể")
      return
    }
    console.log('selectvariant',selectedVariant, selectedFile);
    
    await onSubmit(selectedVariant, selectedFile as File)
    setImageUrl("")
    setPreviewUrl("")
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
    setPreviewUrl(e.target.value)
  }

  const clearImage = () => {
    setImageUrl("")
    setPreviewUrl("")
  }

  if (variants.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">Vui lòng thêm ít nhất một biến thể trước khi thêm hình ảnh.</p>
        <Button onClick={onNext} variant="outline">
          Bỏ qua bước này
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Lưu ý</AlertTitle>
        <AlertDescription>
          Mỗi biến thể sản phẩm có thể có nhiều hình ảnh, nhưng mỗi lần chỉ có thể thêm một hình ảnh. Sau khi thêm một
          hình ảnh, bạn có thể tiếp tục thêm các hình ảnh khác cho cùng một biến thể.
        </AlertDescription>
      </Alert>

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
              {images[variant._id || ""] && images[variant._id || ""].length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Hình ảnh đã thêm ({images[variant._id || ""].length})</h3>
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                    {images[variant._id || ""].map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Hình ảnh ${index + 1} của ${variant.variantName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Thêm hình ảnh mới</CardTitle>
                  <CardDescription>Tải lên hình ảnh cho biến thể {variant.variantName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`file-${variant._id}`}>Tải lên từ thiết bị</Label>
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById(`file-${variant._id}`)?.click()}
                            disabled={isUploading || isSubmitting}
                            className="w-full"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {isUploading ? "Đang tải lên..." : "Chọn hình ảnh"}
                          </Button>
                          <Input
                            id={`file-${variant._id}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                            disabled={isUploading || isSubmitting}
                          />
                        </div>
                      </div>
                    </div>

                    {error && <p className="text-sm font-medium text-destructive">{error}</p>}

                    {previewUrl && (
                      <div className="relative mt-4">
                        <div className="aspect-video rounded-md overflow-hidden border">
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Xem trước hình ảnh"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 bg-background"
                          onClick={clearImage}
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <Button type="submit" disabled={isUploading || isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm hình ảnh
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="pt-4 flex justify-end">
        <Button onClick={onNext} disabled={isSubmitting}>
          Tiếp tục đến xác nhận
        </Button>
      </div>
    </div>
  )
}


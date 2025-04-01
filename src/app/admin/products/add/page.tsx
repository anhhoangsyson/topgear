"use client"
import React, {
  JSX
} from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Check, Package, Layers, ListChecks, Image, FileCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type {
  IProductVariant,
  IProductAttribute,
  ProductFormValues,
  ProductVariantFormValues,
  ProductAttributeFormValues,
  ProductFormData,
} from "@/types"
import { createProduct, createProductVariant, createProductAttribute, createProductImage, uploadImage } from "@/services/api"
import ProductForm from "@/app/admin/components/ui/form/productForm"
import VariantForm from "@/app/admin/components/ui/form/variantForm"
import AttributeForm from "@/app/admin/components/ui/form/attributeForm"
import ImageUploadForm from "@/app/admin/components/ui/form/imageFormUpload"
import ProductSummary from "@/app/admin/components/ui/form/productSumary"

interface Step {
  id: string
  title: string
  icon: React.ElementType
}

const steps: Step[] = [
  { id: "product", title: "Thông tin sản phẩm", icon: Package },
  { id: "variant", title: "Biến thể sản phẩm", icon: Layers },
  { id: "attribute", title: "Thuộc tính biến thể", icon: ListChecks },
  { id: "image", title: "Hình ảnh sản phẩm", icon: Image },
  { id: "summary", title: "Xác nhận & Hoàn tất", icon: FileCheck },
]

export default function AddProductPage(): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [productData, setProductData] = useState<ProductFormData>({
    product: null,
    variants: [],
    attributes: {},
    images: {},
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleProductSubmit = async (data: ProductFormValues): Promise<void> => {
    try {
      setIsSubmitting(true)

      // Gọi API để thêm sản phẩm
      const result = await createProduct(data)

      if (!result.success || !result.data) {
        throw new Error(result.error || "Lỗi không xác định")
      }

      // Cập nhật state với dữ liệu từ server
      setProductData((prev) => ({ ...prev, product: result.data || null }))

      toast({
        title: "Thêm sản phẩm thành công",
        description: `Sản phẩm "${data.productName}" đã được tạo.`,
      })

      nextStep()
    } catch (error) {
      toast({
        title: "Lỗi khi thêm sản phẩm",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi thêm sản phẩm. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVariantSubmit = async (data: ProductVariantFormValues): Promise<void> => {
    try {
      setIsSubmitting(true)

      if (!productData.product?._id) {
        throw new Error("Không tìm thấy ID sản phẩm")
      }

      // Gọi API để thêm biến thể
      const result = await createProductVariant({
        ...data,
        productId: productData.product._id,
      })
      console.log(result);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Lỗi không xác định")
      }

      // Cập nhật state với dữ liệu từ server
      setProductData((prev) => ({
        ...prev,
        variants: [...prev.variants, result.data as IProductVariant],
      }))

      toast({
        title: "Thêm biến thể thành công",
        description: `Biến thể "${data.variantName}" đã được thêm.`,
      })
    } catch (error) {
      toast({
        title: "Lỗi khi thêm biến thể",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi thêm biến thể. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAttributeSubmit = async (variantId: string, data: ProductAttributeFormValues): Promise<void> => {
    try {
      setIsSubmitting(true)

      // Gọi API để thêm thuộc tính
      const result = await createProductAttribute({
        ...data,
        variantId,
      })

      if (!result.success || !result.data) {
        throw new Error(result.error || "Lỗi không xác định")
      }

      // Cập nhật state với dữ liệu từ server
      setProductData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [variantId]: [...(prev.attributes[variantId] || []), result.data as IProductAttribute],
        },
      }))

      toast({
        title: "Thêm thuộc tính thành công",
        description: "Thuộc tính đã được thêm cho biến thể.",
      })
    } catch (error) {
      toast({
        title: "Lỗi khi thêm thuộc tính",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi thêm thuộc tính. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageSubmit = async (variantId: string, imageUrl: File): Promise<void> => {
    console.log("imageUrl", imageUrl);
    console.log("variantId", variantId);

    
    try {
      setIsSubmitting(true)

      // Gọi API để thêm hình ảnh
      const result = await uploadImage(variantId, imageUrl)

      if (!result.success || !result.data) {
        throw new Error(result.error || "Lỗi không xác định")
      }

      // Cập nhật state với dữ liệu từ server
      // setProductData((prev) => ({
      //   ...prev,Z      //   images: {
      //     ...prev.images,
      //     [variantId]: [...(prev.images[variantId] || []), imageUrl],
      //   },
      // }))

      toast({
        title: "Thêm hình ảnh thành công",
        description: "Hình ảnh đã được thêm cho biến thể.",
      })
    } catch (error) {
      toast({
        title: "Lỗi khi thêm hình ảnh",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi thêm hình ảnh. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinalSubmit = async (): Promise<void> => {
    toast({
      title: "Hoàn tất thêm sản phẩm",
      description: "Sản phẩm đã được thêm thành công vào hệ thống.",
    })

    // Chuyển hướng về trang danh sách sản phẩm
    router.push("/products")
  }

  const nextStep = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = (): JSX.Element | null => {
    switch (steps[currentStep].id) {
      case "product":
        return (
          <ProductForm onSubmit={handleProductSubmit} initialData={productData.product} isSubmitting={isSubmitting} />
        )
      case "variant":
        return (
          <VariantForm
            onSubmit={handleVariantSubmit}
            productId={productData.product?._id || ""}
            variants={productData.variants}
            onNext={nextStep}
            isSubmitting={isSubmitting}
          />
        )
      case "attribute":
        return (
          <AttributeForm
            onSubmit={handleAttributeSubmit}
            variants={productData.variants}
            attributes={productData.attributes}
            onNext={nextStep}
            isSubmitting={isSubmitting}
          />
        )
      case "image":
        return (
          <ImageUploadForm
            onSubmit={handleImageSubmit}
            variants={productData.variants}
            images={productData.images}
            onNext={nextStep}
            isSubmitting={isSubmitting}
          />
        )
      case "summary":
        return <ProductSummary productData={productData} onSubmit={handleFinalSubmit} isSubmitting={isSubmitting} />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Thêm sản phẩm mới</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Các bước</CardTitle>
              <CardDescription>Hoàn thành các bước để thêm sản phẩm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {steps.map((step, index) => {
                  const StepIcon = step.icon
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center p-3 rounded-md ${currentStep === index
                          ? "bg-primary text-primary-foreground"
                          : currentStep > index
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                    >
                      <div className="mr-3">
                        {currentStep > index ? (
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </div>
                        ) : (
                          <StepIcon className="h-6 w-6" />
                        )}
                      </div>
                      <span className="font-medium">{step.title}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-3/4">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>
                {currentStep === 0 && "Nhập thông tin cơ bản về sản phẩm"}
                {currentStep === 1 && "Thêm các biến thể cho sản phẩm (ví dụ: kích thước, màu sắc)"}
                {currentStep === 2 && "Thêm thuộc tính chi tiết cho từng biến thể"}
                {currentStep === 3 && "Tải lên hình ảnh cho từng biến thể sản phẩm"}
                {currentStep === 4 && "Xem lại và xác nhận thông tin sản phẩm"}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderStepContent()}</CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 0 || isSubmitting}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>

              {currentStep < steps.length - 1 && steps[currentStep].id !== "product" && (
                <Button onClick={nextStep} disabled={isSubmitting}>
                  Tiếp theo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}


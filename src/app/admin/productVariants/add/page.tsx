'use client';

import { useEffect, useState } from "react";
import VariantForm from "@/app/admin/components/ui/form/variantForm";
import AttributeForm from "@/app/admin/components/ui/form/attributeForm";
import ImageUploadForm from "@/app/admin/components/ui/form/imageFormUpload";
import { Button } from "@/components/ui/Button";
import CategorySelectForm from "@/app/admin/productVariants/add/CategorySelectForm";
import ProductSelectForm from "@/app/admin/productVariants/add/ProductSelectForm";
import { IProductAttribute, ProductAttributeFormValues, ProductFormData, ProductVariantFormValues, StatusProductVariant } from "@/types";
import { createProductAttribute } from "@/schemaValidations/api";
import { toast } from "@/hooks/use-toast";
import { uploadImage } from "@/services/api";

// fakje data prodcut


export default function AddProductVariantPage() {

  const products = [
    {
      "_id": "681829710b3916cf3920e02b",
      "productName": "Laptop Gaming Acer Nitro 5",
      "categoriesId": "67df7a0ba0f195f41ad3ab7f",
      "__v": 0
    },
    {
      "_id": "67e423448ceba80987b5fe2f",
      "productName": "Mac Mini M4",
      "categoriesId": "67df7a0ba0f195f41ad3ab7f",
      "__v": 0
    },
    {
      "_id": "67ff38943e84ebea8041d0d1",
      "productName": "Bàn phím cơ custom Lucky 65 V2",
      "categoriesId": "67fe8631c25cc1af762a158c",
      "__v": 0
    },
    {
      "_id": "680899479cd537a2a2326166",
      "productName": "IPhone 16",
      "categoriesId": "67df79dee5634c8a7f6df94a",
      "__v": 0
    },
    {
      "_id": "68089af29cd537a2a232616e",
      "productName": "IPhone 16",
      "categoriesId": "67df79dee5634c8a7f6df94a",
      "__v": 0
    },
  ]

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [variants, setVariants] = useState<ProductVariantFormValues[]>([]);
  const [attributes, setAttributes] = useState({});
  const [images, setImages] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState<ProductFormData>({
    product: null,
    variants: [],
    attributes: {},
    images: {},
  })
  

  const [categories, setCategories] = useState([])
  // const [products, setProducts] = useState<IProduct[]>([])
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/categories/parent`, {
          method: "GET",
        })
        if (!res.ok) {
          throw new Error("Lỗi khi lấy danh mục")
        }
        const data = await res.json()

        setCategories(data.data)
      } catch (error) {

      }
    }
    fetchCategories()
  }, [])

  // useEffect(() => {
  //   const fetchProductsByCategory = async () => {
  //     if (!selectedCategory) return
  //     try {
  //       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/products/category/${selectedCategory}`, {
  //         method: "GET",
  //       })
  //       if (!res.ok) {
  //         throw new Error("Lỗi khi lấy sản phẩm")
  //       }
  //       const data = await res.json()
  //       // setProducts(data.data)
  //     } catch (error) {
  //       toast({
  //         title: "Lỗi khi lấy sản phẩm",
  //         description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi lấy sản phẩm. Vui lòng thử lại.",
  //         variant: "destructive",
  //       })
  //     }
  //   }

  //   // fetchProductsByCategory()

  //   // setProducts(fakedataProducts)
  //   // console.log('products', fakedataProducts);

  // })



  const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  const handlePreviousStep = () => setCurrentStep((prev) => prev - 1);

  const handleCategorySubmit = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    handleNextStep();
  };

  const handleProductSubmit = async (productId: string) => {
    setSelectedProduct(productId);
    const defaultVariant: ProductVariantFormValues = {
      productId,
      variantName: "",
      variantPrice: 0,
      variantPriceSale: 0,
      filterCategories: [],
      variantStock: 0,
      status: StatusProductVariant.ACTIVE,
    };
    console.log('productId', productId);

    setVariants([defaultVariant])
    handleNextStep();
  };

  const handleVariantSubmit = async (data: ProductVariantFormValues) => {
    setIsSubmitting(true);
    try {
      // Call your API to save the variant data here
      console.log("Variant data:", data);
      setVariants([data]);
      handleNextStep();
    } catch (error) {
      console.error("Error submitting variant:", error);
    } finally {
      setIsSubmitting(false);
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
  return (
    <div className="container mx-auto py-10">
      {currentStep === 1 && (
        <CategorySelectForm
          categories={categories}
          onSubmit={handleCategorySubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {currentStep === 2 && (
        <ProductSelectForm
          products={products}
          // khi nao dung data that thi bo comment1
          // products={products.filter((product) => product.categoriesId === selectedCategory)}
          onSubmit={handleProductSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {currentStep === 3 && (
        <VariantForm
          onSubmit={handleVariantSubmit}
          productId={selectedProduct!}
          variants={variants}
          onNext={handleNextStep}
          isSubmitting={isSubmitting}
        />
      )}

      {currentStep === 4 && (
        <AttributeForm
          onSubmit={handleAttributeSubmit}
          variants={variants}
          attributes={productData.attributes}
          onNext={handleNextStep}
          isSubmitting={isSubmitting}
        />
      )}

      {currentStep === 5 && (
        <ImageUploadForm
          onSubmit={handleImageSubmit}
          variants={variants}
          images={images}
          onNext={handleNextStep}
          isSubmitting={isSubmitting}
        />
      )}

      <div className="flex justify-between mt-4">
        {currentStep > 1 && (
          <Button variant="outline" onClick={handlePreviousStep} disabled={isSubmitting}>
            Quay lại
          </Button>
        )}
      </div>
    </div>
  );
}
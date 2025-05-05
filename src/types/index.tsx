import { z } from "zod"

// Enum cho trạng thái
export enum StatusProductVariant {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

// Interface cho Category
export interface ICategory {
  _id?: string
  categoryName: string
  parentCategoryId?: string
  children?: ICategory[],
  isFilter: boolean,
  isDeleted?: boolean
}

// Interface cho CategoryAttribute
export interface ICategoryAttribute {
  _id?: string
  categoriesId: string
  attributeId: string
  attributeName: string
  createdAt?: Date
  updatedAt?: Date
}

// Interface cho Attribute
export interface IAttribute {
  _id: string
  attributeName: string
  categoryId?: string
}

// Interface cho Product
export interface IProduct {
  _id?: string
  productName: string
  categoriesId: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

// Interface cho ProductVariant
export interface IProductVariant {
  _id?: string
  productId: string
  variantName: string
  variantPrice: number
  variantPriceSale: number
  filterCategories: string[]
  variantStock: number
  status?: StatusProductVariant
  createdAt?: Date
  updatedAt?: Date
}

// Interface cho ProductAttribute
export interface IProductAttribute {
  _id?: string
  variantId: string
  attributeId: string
  attributeValue: string
  status?: StatusProductVariant
  createdAt?: Date
  updatedAt?: Date
}

// Interface cho ProductImage
export interface IProductImage {
  _id?: string
  productVariantId: string
  imageUrl: string
  createdAt?: Date
  updatedAt?: Date
}

// Interface cho ProductVariantDetail (bao gồm attributes và images)
export interface IProductVariantDetail extends IProductVariant {
  attributes: IProductAttribute[]
  images: IProductImage[]
}

// Interface cho ProductDetail (bao gồm variants, attributes và images)
export interface IProductDetail extends IProduct {
  variants: IProductVariantDetail[]
}

// Zod schema cho validation
export const productSchema = z.object({
  productName: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  categoriesId: z.string().min(1, "Vui lòng chọn danh mục sản phẩm"),
})

export const productVariantSchema = z.object({
  productId: z.string(),
  variantName: z.string().min(2, "Tên biến thể phải có ít nhất 2 ký tự"),
  variantPriceSale: z.number().positive("Giá phải là số dương"),
  variantPrice: z.number().positive("Giá phải là số dương"),
  filterCategories: z.array(z.string().min(1, "Vui lòng chọn ít nhất 1 thuộc tính")),
  variantStock: z.number().nonnegative("Số lượng không được âm"),
  status: z.enum([StatusProductVariant.ACTIVE, StatusProductVariant.INACTIVE]),
})

export const productAttributeSchema = z.object({
  // variantId: z.string(),
  attributeId: z.string(),
  attributeValue: z.string().min(1, "Vui lòng nhập giá trị thuộc tính"),
  status: z.enum([StatusProductVariant.ACTIVE, StatusProductVariant.INACTIVE]),
})

export const productImageSchema = z.object({
  productVariantId: z.string(),
  imageUrl: z.string().url("URL hình ảnh không hợp lệ"),
})

// Types cho form data
export type ProductFormValues = z.infer<typeof productSchema>
// export type ProductVariantFormValues = Omit<z.infer<typeof productVariantSchema>, "productId">
export type ProductVariantFormValues = z.infer<typeof productVariantSchema>
export type ProductAttributeFormValues = Omit<z.infer<typeof productAttributeSchema>, "variantId">

// Types cho API requests
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Interface cho dữ liệu tổng hợp của form
export interface ProductFormData {
  product: IProduct | null
  variants: IProductVariant[]
  attributes: Record<string, IProductAttribute[]>
  images: Record<string, string[]>
}

export interface ProductImageRequest {
  productVariantId: string,
  imageUrl: File,
}
export interface ProductVariantDetail {
  images: IProductImage[]
  status?: StatusProductVariant
  variantAttributes?: IProductAttribute[]
  variantName: string
  variantPrice: number
  variantPriceSale: number
  variantStock: number
  _id: string
  // productId: string
}

export interface LocationRes {
  _id: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

export interface customerInfoRes {
  fullname: string;
  phone: string;
  address: string;
}

export interface OrderDetail{
  _id: string;
  productVariantId: string;
  quantity: number;
  price: number;
  subTotal: number;
}

export interface IProductVariantRes extends IProductVariant {
  images: IProductImage[];
  variantName: string
}

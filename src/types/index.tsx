import { z } from "zod"

export interface CustomDocument {
  _id: string
  createdAt: Date
  updatedAt: Date
}

// Enum cho trạng thái
export enum StatusProductVariant {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

// Interface cho Category
export interface ICategory extends Document {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string | null;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
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

export interface OrderDetail {
  _id: string;
  quantity: string;
  price: number;
  subTotal: number;
  name: string;
  slug: string;
  images: {
    _id: string;
    imageUrl: string;
    altText?: string;
    isPrimary?: boolean;
    sortOrder?: number;
  }[];
}

export interface IBrand extends CustomDocument {
  name: string;
  logo: string;
  description: string;
  country: string;
  website: string;
  slug: string;
  isActive: boolean;
}

export interface ISpecifications {
  processor: string; // cpu
  processorGen?: string; // thế hệ 12th gen
  processorSpeed?: number; // tốc độ cpu, đơn vị GHz
  ram: number; // dung lượng ram, đơn vị GB
  ramType?: string; // loại ram, DDR4, DDR5
  storage: number;  // dung lượng ổ cứng, đơn vị GB
  storageType?: string; // loại ổ cứng, SSD, HDD
  graphicsCard?: string; // card đồ họa, ví dụ: NVIDIA GeForce RTX 3060
  graphicsMemory?: number; // dung lượng card đồ họa, đơn vị GB
  displaySize: number; // kích thước màn hình đơn vị inch
  displayResolution?: string; // độ phân giải 1920x1280
  displayType?: string; // loại màn hình, IPS, TN, OLED
  refreshRate?: number; // tần số quét, đơn vị Hz
  touchscreen?: boolean; // cảm ứng hay không
  battery?: string; // dung lượng pin, ví dụ: 50Wh
  batteryLife?: number; // thời gian sử dụng pin, đơn vị giờ
  operatingSystem?: string; // hệ điều hành, ví dụ: Windows 11, macOS
  ports?: string[]; // các cổng kết nối, ví dụ: USB-C, HDMI, Thunderbolt
  webcam?: string; // độ phân giải webcam, ví dụ: 720p, 1080p
  keyboard?: string; // loại bàn phím, ví dụ: bàn phím cơ, bàn phím chiclet
  speakers?: string; // loại loa, ví dụ: loa stereo, loa Dolby Atmos
  connectivity?: string; // kết nối không dây, ví dụ: Wi-Fi 6, Bluetooth 5.0
}

export interface IImage {
  imageUrl: string;
  altText?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface IRatings {
  average: number;
  count: number;
}

export interface ISeoMetadata {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}


export interface ICreateLaptop {
  modelName: string;
  name: string;
  brandId: {
    _id: string;
    name: string;
    logo?: string;
  };
  categoryId: {
    _id: string;
    name: string;
    slug?: string;
  };
  description?: string;
  price: number;
  discountPrice?: number; // giá giảm < giá gốc
  stock: number; // số lượng hàng trong kho
  warranty?: number; // bao hành tính bằng tháng
  releaseYear?: number; // năm phát hành
  status: 'new' | 'refurbished' | 'used'; // tình trạng máy, mới, đã qua sử dụng, tân trang
  weight?: number; // trọng lượng máy tính xách tay
  dimensions?: string; // kích thước máy tính xách tay
  specifications: ISpecifications; // thông số kỹ thuật máy tính xách tay
  images: IImage[];
  ratings: IRatings; // đánh giá trung bình và số lượng đánh giá
  isActive: boolean;
  isPromoted: boolean; // có được quảng cáo hay không
  tags?: string[]; // từ khóa tìm kiếm
  seoMetadata?: ISeoMetadata; // metadata cho SEO
  createdAt: Date;
  updatedAt: Date;
}

export type LaptopResponse<T extends ICreateLaptop> = T & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
}

export type ILaptop = LaptopResponse<ICreateLaptop>

export interface ILaptopGroup extends CustomDocument {
  _id: string;
  name: string;
  laptops: ILaptop[];
  slug: string;
  description?: string;
  backgroundImage?: string;
  createdAt: Date;
  isActive: boolean;
  sortOrder: number;
  isPromoted?: boolean;
}

export interface IVoucher {
  _id?: string;
  code?: string;
  type: 'code' | 'auto';
  expiredDate: Date;
  pricePercent: number;
  priceOrigin: number;
  status: 'active' | 'inactive';
}

export interface IBlog extends CustomDocument {
  title: string;
  content: string;
  userId: {
    // _id: string;
    fullname: string;
  }
  tags: string[];
  thumbnail: string;
  slug: string;
}

export interface IOrderWithDetails {
  _id: string;
  voucherId?: string | null;
  customerId: string;
  totalAmount: number;
  orderStatus: string;
  address: string;
  discountAmount: number;
  paymentMethod: string;
  paymentTransactionId: string | null;
  paymentUrl: string | null;
  orderDetails: {
    _id: string; 
    laptopId: string;
    quantity: number;
    price: number;
    subTotal: number;
    images:IImage[];
  }[];
  user:{
    fullname: string;
    phone: string;
    email: string;
  }
}
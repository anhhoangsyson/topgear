import type {
  IProduct,
  IProductVariant,
  IProductAttribute,
  IProductImage,
  ApiResponse,
  ProductFormValues,
  ProductVariantFormValues,
  ProductAttributeFormValues,
} from "@/types"

// Base URL cho API
const API_BASE_URL = "https://top-gear-be.vercel.app/api/v1"

// Helper function để xử lý response
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {

    const errorData = await response.json().catch(() => ({}))
    console.log('error in handleResponse: ', errorData);
    return {
      success: false,
      error: errorData.message || `Lỗi: ${response.status} ${response.statusText}`,
    }
  }

  const data = await response.json()

  return {
    success: true,
    data: data.data,
  }
}

// API để lấy danh sách danh mục
export async function getCategories(): Promise<ApiResponse<any[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/parent`)
    return handleResponse(response)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định khi lấy danh mục",
    }
  }
}

// API để lấy danh sách thuộc tính theo danh mục
export async function getAttributesByCategory(productId: string): Promise<ApiResponse<any[]>> {
  try {
    const productRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/products/${productId}`)
    const productData = await productRes.json()
    const categoryId = productData?.data?.categoriesId
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/attribute/getByCategoryId/${categoryId}`)

    return handleResponse(response)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định khi lấy thuộc tính",
    }
  }
}

// API để thêm sản phẩm
export async function createProduct(productData: ProductFormValues): Promise<ApiResponse<IProduct>> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })

    return handleResponse<IProduct>(response)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định khi thêm sản phẩm",
    }
  }
}

// API để thêm biến thể sản phẩm
export async function createProductVariant(
  variantData: ProductVariantFormValues & { productId: string },
): Promise<ApiResponse<IProductVariant>> {

  try {
    const response = await fetch(`${API_BASE_URL}/pvariants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variantData),

    })

    return handleResponse<IProductVariant>(response)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định khi thêm biến thể",
    }
  }
}

// API để thêm thuộc tính cho biến thể
export async function createProductAttribute(
  attributeData: ProductAttributeFormValues & { variantId: string },
): Promise<ApiResponse<IProductAttribute>> {
  try {
    const response = await fetch(`${API_BASE_URL}/pattributes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attributeData),
    })

    return handleResponse<IProductAttribute>(response)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định khi thêm thuộc tính",
    }
  }
}

// API để tải lên hình ảnh
export async function uploadImage(id: string, file: File): Promise<ApiResponse<{ imageUrl: string }>> {
  try {
    const formData = new FormData()
    formData.append("imageUrl", file)
    formData.append("productVariantId", id)
    const response = await fetch(`${API_BASE_URL}/pimages`, {
      method: "POST",
      body: formData,
    })

    return handleResponse<{ imageUrl: string }>(response)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định khi tải lên hình ảnh",
    }
  }
}

// API để thêm hình ảnh cho biến thể
export async function createProductImage(imageData: { productVariantId: string; imageUrl: string }): Promise<
  ApiResponse<IProductImage>
> {
  try {
    const response = await fetch(`${API_BASE_URL}/product-images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(imageData),
    })

    return handleResponse<IProductImage>(response)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định khi thêm hình ảnh",
    }
  }
}


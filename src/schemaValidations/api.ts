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
  const API_BASE_URL = "/api"
  
  // Helper function để xử lý response
  async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || `Lỗi: ${response.status} ${response.statusText}`,
      }
    }
  
    const data = await response.json()
    return {
      success: true,
      data,
    }
  }
  
  // API để lấy danh sách danh mục
  export async function getCategories(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      return handleResponse(response)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Lỗi không xác định khi lấy danh mục",
      }
    }
  }
  
  // API để lấy danh sách thuộc tính theo danh mục
  export async function getAttributesByCategory(categoryId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/attributes?categoryId=${categoryId}`)
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
      const response = await fetch(`${API_BASE_URL}/product-variants`, {
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
      const response = await fetch(`${API_BASE_URL}/product-attributes`, {
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
  export async function uploadImage(variantId: string, file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    try {
      const formData = new FormData()
      formData.append("image", file)
  
      const response = await fetch(`${API_BASE_URL}/upload`, {
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
  
  
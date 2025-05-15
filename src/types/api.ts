// types/api.ts
export interface SuccessResponse<T> {
    data: T
    message?: string
  }
  
  export interface ErrorResponse {
    error: {
      code: string
      message: string
      details?: unknown
    }
  }
  
  export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse
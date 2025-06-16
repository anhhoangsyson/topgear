import { toast } from "@/hooks/use-toast";

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export class ApiException extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'ApiException';
  }
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'Có lỗi xảy ra';
    let errorData: any = null;

    try {
      errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiException(errorMessage, response.status, errorData?.code);
  }

  try {
    return await response.json();
  } catch {
    throw new ApiException('Không thể parse response JSON', 500);
  }
}

export function handleApiError(error: unknown, fallbackMessage = 'Có lỗi xảy ra') {
  console.error('API Error:', error);

  let message = fallbackMessage;
  let shouldRedirectToLogin = false;

  if (error instanceof ApiException) {
    message = error.message;
    if (error.status === 401) {
      shouldRedirectToLogin = true;
      message = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  toast({
    title: "Lỗi",
    description: message,
    variant: "destructive",
    duration: 3000,
  });

  if (shouldRedirectToLogin) {
    // Clear token cache
    import('@/lib/token-manager').then(({ TokenManager }) => {
      TokenManager.clearToken();
    });
    window.location.href = '/login';
  }
}

export async function apiCall<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    return await handleApiResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    throw new ApiException('Network error', 0);
  }
}

export function withLoading<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };
}
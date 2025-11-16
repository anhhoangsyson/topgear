const API_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'https://top-gear-be.vercel.app/api/v1';

export async function callApi(endpoint: string, method: string, accessToken?: string, body?: unknown) {
  const headers: HeadersInit = {
    Accept: 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${API_URL}${normalizedEndpoint}`;

  const response = await fetch(`${fullUrl}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    if (response.status === 401) {
      return { error: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', status: 401 };
    }
    throw new Error(`Backend error: ${response.status} - ${text.slice(0, 100)}`);
  }
  return response.json();
}

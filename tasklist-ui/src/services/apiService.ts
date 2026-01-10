const API_BASE_URL = import.meta.env.VITE_API_URL ?? "https://localhost:7082/api/";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiOptions {
  method?: HttpMethod;
  body?: any;
  token?: string | null;
  headers?: Record<string, string>;
  skipErrorHandling?: boolean;
  responseType?: "json" | "blob" | "text";
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = "GET", body, token, headers = {}, skipErrorHandling = false, responseType = "json" } = options;

  try {
    const isFormData = body instanceof FormData;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      //handle file uploads if needed
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    });

    // If skipErrorHandling is true, always return the requested type (for login)
    if (skipErrorHandling) {
      if (responseType === "blob") return response.blob() as Promise<T>;
      if (responseType === "text") return response.text() as unknown as Promise<T>;
      return response.json() as Promise<T>;
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    if (responseType === "blob") return response.blob() as Promise<T>;
    if (responseType === "text") return response.text() as unknown as Promise<T>;
    return response.json() as Promise<T>;
  } catch (error) {
    // Re-throw the error so it can be caught by the caller
    throw error;
  }
}

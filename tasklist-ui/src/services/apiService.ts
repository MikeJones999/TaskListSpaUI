const API_BASE_URL = import.meta.env.VITE_API_URL ?? "https://localhost:7082/api/";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface ApiOptions {
  method?: HttpMethod;
  body?: any;
  token?: string | null;
  headers?: Record<string, string>;
  skipErrorHandling?: boolean; 
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = "GET", body, token, headers = {}, skipErrorHandling = false } = options;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // If skipErrorHandling is true, always return the JSON (for login)
    if (skipErrorHandling) {
      return response.json() as Promise<T>;
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    // Re-throw the error so it can be caught by the caller
    throw error;
  }
}

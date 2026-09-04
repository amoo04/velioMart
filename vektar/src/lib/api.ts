import { storage } from "./storage";

export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5000";

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

async function getToken(): Promise<string | null> {
  return storage.getToken();
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = await getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // avoids ngrok's HTML interstitial warning page when BASE_URL is a
    // free-tier ngrok tunnel; harmless against any other host
    "ngrok-skip-browser-warning": "1",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      const message = Array.isArray(body?.error)
        ? body.error.map((e: { message: string }) => e.message).join(", ")
        : (body?.error ?? `Request failed with status ${res.status}`);
      return {
        error: message,
        status: res.status,
      };
    }

    return { data: body as T, status: res.status };
  } catch (err: any) {
    return {
      error: err.message ?? "Network request failed",
      status: 0,
    };
  }
}

export async function apiGet<T = unknown>(path: string) {
  return apiRequest<T>(path, { method: "GET" });
}

export async function apiPost<T = unknown>(path: string, body?: unknown) {
  return apiRequest<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPatch<T = unknown>(path: string, body?: unknown) {
  return apiRequest<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T = unknown>(path: string) {
  return apiRequest<T>(path, { method: "DELETE" });
}

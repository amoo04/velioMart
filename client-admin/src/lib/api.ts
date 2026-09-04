export const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  return url.startsWith("/") ? `${BASE_URL}${url}` : url;
}

const TOKEN_KEY = "admin_token";

export const tokenStorage = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};

export const SESSION_EXPIRED_EVENT = "admin:session-expired";

function handleUnauthorized() {
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = tokenStorage.get();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    const body = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 401 && token) handleUnauthorized();
      const message = Array.isArray(body?.error)
        ? body.error.map((e: { message: string }) => e.message).join(", ")
        : (body?.error ?? `Request failed with status ${res.status}`);
      return { error: message, status: res.status };
    }

    return { data: body as T, status: res.status };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Network request failed",
      status: 0,
    };
  }
}

export function apiGet<T = unknown>(path: string) {
  return apiRequest<T>(path, { method: "GET" });
}

export function apiPost<T = unknown>(path: string, body?: unknown) {
  return apiRequest<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiPatch<T = unknown>(path: string, body?: unknown) {
  return apiRequest<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiDelete<T = unknown>(path: string) {
  return apiRequest<T>(path, { method: "DELETE" });
}

export async function apiUpload<T = unknown>(path: string, formData: FormData): Promise<ApiResponse<T>> {
  const token = tokenStorage.get();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE_URL}${path}`, { method: "POST", headers, body: formData });
    const body = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 401 && token) handleUnauthorized();
      const message = Array.isArray(body?.error)
        ? body.error.map((e: { message: string }) => e.message).join(", ")
        : (body?.error ?? `Request failed with status ${res.status}`);
      return { error: message, status: res.status };
    }

    return { data: body as T, status: res.status };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Network request failed",
      status: 0,
    };
  }
}

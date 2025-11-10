// Simple API helper centralizing base URL, headers and error handling
// Uses VITE_API_BASE_URL if provided, otherwise falls back to sensible defaults for dev/prod

const fallbackBase = (() => {
  try {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      const port = window.location.port;
      // Local development defaults: always hit API on 3000
      if (host === 'localhost' || host === '127.0.0.1') {
        return 'http://localhost:3000/api';
      }
      // Otherwise, assume reverse proxy with same-origin /api
      return '/api';
    }
  } catch {}
  return '/api';
})();

const API_BASE: string = (import.meta as any).env?.VITE_API_BASE_URL || fallbackBase;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch (networkErr: any) {
    throw new Error(`Falha de conexão com API (${API_BASE}${path}): ${networkErr?.message || networkErr}`);
  }
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : (await res.text());
  if (!res.ok) {
    const message = (data as any)?.message || res.statusText || 'Erro na requisição';
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${message}`);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string, init: RequestInit = {}) => request<T>(path, { ...init, method: 'GET' }),
  post: <T>(path: string, body?: unknown, init: RequestInit = {}) =>
    request<T>(path, { ...init, method: 'POST', body: body != null ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown, init: RequestInit = {}) =>
    request<T>(path, { ...init, method: 'PUT', body: body != null ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string, init: RequestInit = {}) => request<T>(path, { ...init, method: 'DELETE' }),
  base: API_BASE,
};

export default api;

const BASE = '/api'

export function getToken(): string | null {
  return localStorage.getItem('ms_token')
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem('ms_token', token)
  else localStorage.removeItem('ms_token')
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = getToken()
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error((err as { error?: string }).error ?? res.statusText)
  }
  return res.json() as Promise<T>
}

export const api = {
  get:    <T = unknown>(path: string)               => request<T>('GET',    path),
  post:   <T = unknown>(path: string, body?: unknown) => request<T>('POST',   path, body),
  patch:  <T = unknown>(path: string, body: unknown)  => request<T>('PATCH',  path, body),
  delete: <T = unknown>(path: string)               => request<T>('DELETE', path),
}

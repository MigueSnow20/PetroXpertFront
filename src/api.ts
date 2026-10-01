import type { Summary } from './types'

const productionBackend = 'https://petroxpertbackend.fly.dev'
const base = (import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_BACKEND_URL
  ?? (import.meta.env.PROD ? productionBackend : '')).replace(/\/$/, '')

async function request<T>(path: string, method = 'GET', body?: unknown, signal?: AbortSignal,
  onResponse?: (response: Response) => void): Promise<T> {
  const timeout = AbortSignal.timeout(12000)
  const response = await fetch(`${base}/api/v1${path}`, {
    method,
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.detail ?? `Servicio no disponible (${response.status})`)
  }
  onResponse?.(response)
  return response.json() as Promise<T>
}
export const api = {
  summary: (signal: AbortSignal, onResponse: (response: Response) => void) =>
    request<Summary>('/markets/summary', 'GET', undefined, signal, onResponse),
  save: (resource: 'closings' | 'premiums' | 'reports', body: unknown, signal: AbortSignal) =>
    request<{ status: string; message: string }>(`/${resource}`, 'POST', body, signal),
}

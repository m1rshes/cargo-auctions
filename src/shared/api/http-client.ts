import { API_BASE_URL } from '../config/api';
import type { ApiErrorResponse, ValidationErrorResponse } from './schema';

export class ApiError extends Error {
  status: number;
  body: ApiErrorResponse | ValidationErrorResponse | null;

  constructor(status: number, body: ApiErrorResponse | ValidationErrorResponse | null, message?: string) {
    super(message ?? body?.message ?? `Request failed with status ${status}`);
    this.status = status;
    this.body = body;
  }

  isValidationError(): this is ApiError & { body: ValidationErrorResponse } {
    return this.status === 422 && !!this.body && 'errors' in this.body;
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * Строит URL и выполняет запрос к API. Изолирован от React/Query, чтобы
 * его было легко покрыть модульными тестами (см. request-builder.test.ts).
 */
export function buildUrl(path: string, params?: Record<string, unknown>): string {
  const url = new URL(API_BASE_URL + path, window.location.origin);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') continue;
      if (Array.isArray(value)) {
        for (const v of value) url.searchParams.append(key, String(v));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.pathname + url.search;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(API_BASE_URL + path, {
    method: options.method ?? 'GET',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  if (!res.ok) {
    let body: ApiErrorResponse | ValidationErrorResponse | null = null;
    try {
      body = await res.json();
    } catch {
      // no body
    }
    throw new ApiError(res.status, body);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

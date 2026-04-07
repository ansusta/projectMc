/**
 * Base API layer — wraps fetch calls to the backend REST API.
 * Automatically injects the Supabase JWT token from localStorage.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken(): string | null {
    try {
        // Supabase stores the session in localStorage under a specific key
        const key = Object.keys(localStorage).find((k) => k.includes('auth-token') || k.includes('supabase'));
        if (key) {
            const raw = localStorage.getItem(key);
            if (raw) {
                const parsed = JSON.parse(raw);
                return parsed?.access_token || parsed?.session?.access_token || null;
            }
        }
        // Fallback: custom storage
        return localStorage.getItem('auth_token');
    } catch {
        return null;
    }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(errorBody.error || `HTTP error ${res.status}`);
    }

    return res.json() as T;
}

export const api = {
    get: <T>(path: string) => request<T>(path, { method: 'GET' }),
    post: <T>(path: string, body: unknown) =>
        request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    patch: <T>(path: string, body: unknown) =>
        request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

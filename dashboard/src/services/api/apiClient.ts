interface ApiErrorShape {
    error: {
        code: string
        message: string
    }
}

export class ApiError extends Error {
    code: string

    constructor(code: string, message: string) {
        super(message)
        this.name = 'ApiError'
        this.code = code
    }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

const buildUrl = (path: string) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`

const normalizeError = async (response: Response) => {
    const payload = (await response.json().catch(() => null)) as ApiErrorShape | null

    if (payload?.error) {
        throw new ApiError(payload.error.code, payload.error.message)
    }

    throw new ApiError('REQUEST_FAILED', response.statusText || 'Request failed')
}

const getAuthHeader = () => {
    const token = localStorage.getItem('smartdoor_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * API client helper for communicating with backend endpoints.
 */
const apiClient = {
    get: async <T>(path: string): Promise<T> => {
        const response = await fetch(buildUrl(path), {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
        })

        if (!response.ok) {
            await normalizeError(response)
        }

        return response.json() as Promise<T>
    },
    post: async <T>(path: string, body: unknown): Promise<T> => {
        const response = await fetch(buildUrl(path), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            await normalizeError(response)
        }

        return response.json() as Promise<T>
    },
}

export default apiClient

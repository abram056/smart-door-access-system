import { useEffect, useState } from 'react'
import apiClient, { ApiError } from '../services/api/apiClient'

interface UseFetchState<T> {
    data: T | null
    loading: boolean
    error: Error | null
}

/**
 * useFetch is a hook for loading data from the backend.
 */
const useFetch = <T>(endpoint: string) => {
    const [state, setState] = useState<UseFetchState<T>>({
        data: null,
        loading: true,
        error: null,
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                setState((prev) => ({ ...prev, loading: true, error: null }))
                const data = await apiClient.get<T>(endpoint)
                setState({ data, loading: false, error: null })
            } catch (err) {
                const error = err instanceof Error ? err : new Error(String(err))
                setState({ data: null, loading: false, error })
            }
        }

        if (endpoint) {
            fetchData()
        }
    }, [endpoint])

    return state
}

export default useFetch

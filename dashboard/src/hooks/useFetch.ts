import { useCallback, useEffect, useState } from 'react'
import apiClient from '../services/api/apiClient'

interface UseFetchState<T> {
    data: T | null
    loading: boolean
    error: Error | null
}

export interface UseFetchResult<T> extends UseFetchState<T> {
    refetch: () => void
}

/**
 * useFetch is a hook for loading data from the backend.
 */
const useFetch = <T>(endpoint: string): UseFetchResult<T> => {
    const [state, setState] = useState<UseFetchState<T>>({
        data: null,
        loading: true,
        error: null,
    })
    const [trigger, setTrigger] = useState(0)

    const refetch = useCallback(() => setTrigger((n) => n + 1), [])

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
    }, [endpoint, trigger])

    return { ...state, refetch }
}

export default useFetch

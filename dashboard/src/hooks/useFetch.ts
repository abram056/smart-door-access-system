/**
 * useFetch is a placeholder hook for loading data.
 */
const useFetch = <T>(_endpoint: string) => {
    // TODO: implement data fetching hook
    return {
        data: null as T | null,
        loading: false,
        error: null as Error | null,
    }
}

export default useFetch

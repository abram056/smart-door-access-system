import { useAuthContext } from '../contexts/AuthContext'

/**
 * useAuth exposes authentication state and actions.
 */
const useAuth = () => {
    const auth = useAuthContext()

    return {
        isAuthenticated: auth.isAuthenticated,
        login: auth.login,
        logout: auth.logout,
    }
}

export default useAuth

import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

interface AuthContextValue {
    isAuthenticated: boolean
    login: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
    isAuthenticated: false,
    login: async () => { },
    logout: async () => { },
})

interface AuthProviderProps {
    children: ReactNode
}

/**
 * AuthProvider exposes authentication state to the app.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const login = async () => {
        // TODO: implement auth login
    }

    const logout = async () => {
        // TODO: implement auth logout
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated: false, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext)

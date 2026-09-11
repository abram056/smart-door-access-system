import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import authService from '../services/auth/authService'

interface AuthContextValue {
    isAuthenticated: boolean
    login: (username: string, password: string) => Promise<void>
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
    const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('smartdoor_token')))

    const login = async (username: string, password: string) => {
        await authService.login(username, password)
        setIsAuthenticated(true)
    }

    const logout = async () => {
        await authService.logout()
        setIsAuthenticated(false)
    }

    const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext)

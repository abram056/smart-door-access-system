import apiClient from '../api/apiClient'
import { ApiRoutes } from '@smartdoor/shared'

interface LoginResponse {
    access_token: string
    expires_in: number
}

/**
 * AuthService handles authentication-related actions.
 */
const authService = {
    login: async (username: string, password: string) => {
        const response = await apiClient.post<LoginResponse>(ApiRoutes.LOGIN, { username, password })
        localStorage.setItem('smartdoor_token', response.access_token)
        return response
    },
    logout: async () => {
        localStorage.removeItem('smartdoor_token')
        return Promise.resolve()
    },
}

export default authService

/**
 * AuthService handles authentication-related actions.
 */
const authService = {
    login: async (_username: string, _password: string) => {
        // TODO: implement login request
        return Promise.resolve({ token: '' })
    },
    logout: async () => {
        // TODO: implement logout request
        return Promise.resolve()
    },
}

export default authService

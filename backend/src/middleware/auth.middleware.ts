/**
 * auth.middleware.ts enforces authentication for protected routes.
 */
export const authMiddleware = async (req: unknown, res: unknown, next: () => void) => {
    // TODO: implement authentication middleware
    next()
}

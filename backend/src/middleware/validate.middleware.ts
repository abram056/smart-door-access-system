/**
 * validate.middleware.ts validates requests against schemas.
 */
export const validateMiddleware = (schema: unknown) => {
    return async (req: unknown, res: unknown, next: () => void) => {
        // TODO: implement validation middleware
        next()
    }
}

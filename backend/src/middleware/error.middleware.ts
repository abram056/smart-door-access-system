/**
 * error.middleware.ts handles errors across the application.
 */
export const errorMiddleware = (err: unknown, req: unknown, res: unknown, next: () => void) => {
    // TODO: implement error handling
    next()
}

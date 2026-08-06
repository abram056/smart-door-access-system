/**
 * access.types.ts defines access-related types.
 */
export interface AccessRecord {
    id: string
    userId: string
    deviceId: string
    granted: boolean
}

// Standard error codes used in the { error: { code, message } } shape
// (docs/05_Message_Contracts.md — Standard Error Format).
//
// NOTE: these are HTTP-layer error codes. They are a different concept from
// AccessReason (shared/src/types/AccessLog.ts), which describes the outcome
// of a *successful* 200 OK access-decision response. A denied access attempt
// is not an HTTP error.

export const ErrorCodes = {
  // General
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  INTERNAL_ERROR: "INTERNAL_ERROR",

  // Auth (admin)
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_TOKEN: "INVALID_TOKEN",
  FORBIDDEN: "FORBIDDEN",

  // Users / Cards
  USER_NOT_FOUND: "USER_NOT_FOUND",
  CARD_NOT_FOUND: "CARD_NOT_FOUND",
  CARD_ALREADY_EXISTS: "CARD_ALREADY_EXISTS",
  USER_ALREADY_HAS_CARD: "USER_ALREADY_HAS_CARD",
  ENROLLMENT_SESSION_NOT_FOUND: "ENROLLMENT_SESSION_NOT_FOUND",

  // Devices
  DEVICE_NOT_FOUND: "DEVICE_NOT_FOUND",
  INVALID_DEVICE_TOKEN: "INVALID_DEVICE_TOKEN",
  DEVICE_DISABLED: "DEVICE_DISABLED",
  DOOR_NOT_FOUND: "DOOR_NOT_FOUND",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

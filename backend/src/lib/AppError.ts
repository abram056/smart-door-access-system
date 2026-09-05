import { ErrorCodes, type ErrorCode } from "@smartdoor/shared";

/**
 * Throw this anywhere in a controller/service. error.middleware.ts catches it
 * and renders the standard { error: { code, message } } shape (docs/05).
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;

  constructor(statusCode: number, code: ErrorCode, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static validation(message: string) {
    return new AppError(400, ErrorCodes.VALIDATION_ERROR, message);
  }

  static notFound(code: ErrorCode, message: string) {
    return new AppError(404, code, message);
  }

  static unauthorized(code: ErrorCode, message: string) {
    return new AppError(401, code, message);
  }

  static forbidden(message: string) {
    return new AppError(403, ErrorCodes.FORBIDDEN, message);
  }

  static conflict(code: ErrorCode, message: string) {
    return new AppError(409, code, message);
  }

  static internal(message = "Something went wrong.") {
    return new AppError(500, ErrorCodes.INTERNAL_ERROR, message);
  }
}

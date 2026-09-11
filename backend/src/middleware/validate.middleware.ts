import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { AppError } from "../lib/AppError";

type Target = "body" | "query" | "params";

/**
 * validate("body", loginSchema) -> parses req.body, replaces it with the
 * parsed+typed result, or throws a 400 VALIDATION_ERROR with a readable
 * message built from every zod issue.
 */
export function validate(target: Target, schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".") || target}: ${issue.message}`)
        .join("; ");
      next(AppError.validation(message));
      return;
    }
    // Reassign so downstream handlers get coerced/defaulted values.
    // Express defines req.query as a getter-only property on the prototype,
    // so we must redefine it on the instance to shadow the getter.
    if (target === "query") {
      Object.defineProperty(req, "query", {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } else {
      (req as any)[target] = result.data;
    }
    next();
  };
}

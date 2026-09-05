export const Roles = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  GUEST: "GUEST",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

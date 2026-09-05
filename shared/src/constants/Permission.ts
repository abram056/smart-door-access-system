export const Permissions = {
  VIEW_LOGS: "VIEW_LOGS",
  MANAGE_USERS: "MANAGE_USERS",
  MANAGE_CARDS: "MANAGE_CARDS",
  MANAGE_DEVICES: "MANAGE_DEVICES",
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];

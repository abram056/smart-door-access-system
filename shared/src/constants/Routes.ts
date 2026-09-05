// Relative to the /api prefix (see backend routes.ts).

export const ApiRoutes = {
  LOGIN: "/auth/login",

  USERS: "/users",

  CARDS: "/cards",
  CARDS_ENROLL: "/cards/enroll",
  CARDS_ENROLL_CONFIRM: "/cards/enroll/confirm",

  DEVICES: "/devices",
  DEVICES_HEARTBEAT: "/devices/heartbeat",

  ACCESS: "/access",
  ACCESS_LOGS_SYNC: "/access/logs/sync",

  LOGS: "/logs",
} as const;

// Matches prisma/schema.prisma AccessLog model + docs/05 Contracts 2 & 3

export enum AccessResult {
  GRANTED = "GRANTED",
  DENIED = "DENIED",
}

export enum AccessReason {
  AUTHORIZED = "AUTHORIZED",
  UNKNOWN_CARD = "UNKNOWN_CARD",
  NO_PERMISSION = "NO_PERMISSION",
  USER_DISABLED = "USER_DISABLED",
  DEVICE_DISABLED = "DEVICE_DISABLED",
  OFFLINE_CACHE = "OFFLINE_CACHE",
  SYSTEM_ERROR = "SYSTEM_ERROR",
}

export interface AccessLog {
  id: string;
  timestamp: string; // ISO string over the wire
  result: AccessResult;
  reason: AccessReason;
  offline: boolean;
  rfidUid?: string | null;
  deviceId?: string | null;
  doorId?: string | null;
  userId?: string | null;
  cardId?: string | null;
}

// Contract 2 — POST /api/access
export interface AccessRequest {
  rfid_uid: string;
  timestamp: string;
}

export interface AccessResponse {
  granted: boolean;
  unlock_duration: number; // seconds
  message: string;
  reason: AccessReason;
}

// Contract 3 — POST /api/access/logs/sync
export interface OfflineLogEntry {
  rfid_uid: string;
  timestamp: string;
  result: AccessResult;
  reason: AccessReason;
}

export interface LogSyncRequest {
  logs: OfflineLogEntry[];
}

export interface LogSyncResponse {
  uploaded: number;
}

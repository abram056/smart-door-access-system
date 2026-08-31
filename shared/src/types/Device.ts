// Matches prisma/schema.prisma Device model + docs/05 Contracts 1 & 6

export enum DeviceStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  DISABLED = "DISABLED",
}

export interface Device {
  id: string;
  deviceId: string;
  deviceToken: string;
  name: string;
  firmwareVersion?: string | null;
  status: DeviceStatus;
  lastSeen?: string | null;
  doorId: string;
}

// Contract 6 — Device Provisioning
export interface DeviceRegisterRequest {
  device_name: string;
  door_name: string;
}

export interface DeviceRegisterResponse {
  device_id: string;
  device_token: string;
}

// Contract 1 — Heartbeat
export interface HeartbeatRequest {
  firmware_version: string;
  door_state: "LOCKED" | "UNLOCKED";
  signal_strength: number;
}

export interface HeartbeatResponse {
  status: "OK";
  heartbeat_interval: number; // seconds
}

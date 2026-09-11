// System settings — managed via the Settings dashboard page.
// Backend stores these as key/value pairs in the SystemSetting table.

export interface SystemSettings {
  heartbeat_interval: number;
  unlock_duration: number;
  emergency_cards: string[];
}

export interface UpdateSettingsRequest {
  heartbeat_interval?: number;
  unlock_duration?: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface SystemInfo {
  version: string;
  uptime: number;
  nodeEnv: string;
  databaseConnected: boolean;
}

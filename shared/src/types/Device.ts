export enum DeviceStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    DISABLED = "DISABLED"
}

export interface Device {

    id: string;

    name: string;

    token: string;

    doorId: string;

    status: DeviceStatus;

    firmwareVersion?: string;

    lastSeen: Date;
}
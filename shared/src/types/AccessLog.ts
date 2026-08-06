export enum AccessDecision {
    GRANTED = "GRANTED",
    DENIED = "DENIED",
    OFFLINE_GRANTED = "OFFLINE_GRANTED",
    OFFLINE_DENIED = "OFFLINE_DENIED"
}

export interface AccessLog {

    id: string;

    timestamp: Date;

    uid: string;

    username: string;

    decision: AccessDecision;

    doorId: string;

    deviceId: string;
}
// Matches docs/05 Contract 4 + docs/04 Event 5 (Card Enrollment)

export enum EnrollmentStatus {
  WAITING = "WAITING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

// Dashboard -> Backend: start a session for a given user
export interface EnrollStartRequest {
  userId: string;
}

export interface EnrollStartResponse {
  sessionId: string;
  status: EnrollmentStatus.WAITING;
}

// ESP32 -> Backend: confirm with the scanned uid (Contract 4)
export interface EnrollConfirmRequest {
  rfid_uid: string;
}

export type EnrollConfirmResponse =
  | { status: "REGISTERED"; user: string }
  | { status: "FAILED"; reason: "CARD_ALREADY_EXISTS" };

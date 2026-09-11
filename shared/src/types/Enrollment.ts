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

// On success: { status: "REGISTERED", user: string }
// On duplicate uid: HTTP 409 { error: { code: "CARD_ALREADY_EXISTS", message: string } }
export type EnrollConfirmResponse = { status: "REGISTERED"; user: string };

import { randomUUID } from "crypto";
import { EnrollmentStatus } from "@smartdoor/shared";

interface EnrollmentSession {
  sessionId: string;
  userId: string;
  status: EnrollmentStatus;
  createdAt: number;
}

// Prototype-scope: a single in-memory session is enough (docs/09 assumes one
// backend instance during development). If this ever needs to survive a
// restart or run across multiple instances, move this to Redis or a DB table.
const SESSION_TTL_MS = 2 * 60 * 1000; // 2 minutes to tap the card
const sessions = new Map<string, EnrollmentSession>();

function purgeExpired() {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.createdAt > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}

export function startSession(userId: string): EnrollmentSession {
  purgeExpired();
  const session: EnrollmentSession = {
    sessionId: randomUUID(),
    userId,
    status: EnrollmentStatus.WAITING,
    createdAt: Date.now(),
  };
  sessions.set(session.sessionId, session);
  return session;
}

// The prototype's enrollment confirm (Contract 4) doesn't carry a sessionId —
// the ESP32 just posts the scanned uid. So we take the single most recent
// WAITING session as "the one currently enrolling." Good enough for a
// one-admin, one-device prototype; documented as a known simplification.
export function getActiveSession(): EnrollmentSession | undefined {
  purgeExpired();
  let latest: EnrollmentSession | undefined;
  for (const session of sessions.values()) {
    if (session.status !== EnrollmentStatus.WAITING) continue;
    if (!latest || session.createdAt > latest.createdAt) {
      latest = session;
    }
  }
  return latest;
}

export function completeSession(sessionId: string, status: EnrollmentStatus) {
  const session = sessions.get(sessionId);
  if (session) {
    session.status = status;
  }
}

export function getSessionStatus(): EnrollmentStatus | undefined {
  purgeExpired();
  let latest: EnrollmentSession | undefined;
  for (const session of sessions.values()) {
    if (!latest || session.createdAt > latest.createdAt) latest = session;
  }
  return latest?.status;
}

import { AccessReason, AccessResult, type AccessResponse } from "@smartdoor/shared";
import { prisma } from "../../lib/prisma";
import { emitAccessLogCreated } from "../../websocket";
import type { Device, Door } from "../../generated/prisma";

const UNLOCK_DURATION_SECONDS = 5;

interface Decision {
  granted: boolean;
  reason: AccessReason;
  message: string;
}

/**
 * Implements the decision tree in docs/04_Event_Protocols.md — Event 2:
 *
 *   Device Valid? -> (already enforced by device.middleware before this runs)
 *   Card Exists?  -> NO: UNKNOWN_CARD
 *   User Active?  -> NO: USER_DISABLED
 *   Permission?   -> NO: NO_PERMISSION
 *   -> AUTHORIZED
 *
 * "Permission" has no dedicated model yet (backend.md stretch: "door
 * permissions per user (future)"). For the prototype, permission = the card
 * itself is ACTIVE (not LOST/DISABLED) and belongs to the user in question.
 * A disabled/lost card isn't literally "unknown", so NO_PERMISSION is the
 * closest fit among the Contract 2 reason enum rather than inventing a new
 * value not in docs/05.
 */
async function decide(rfidUid: string): Promise<Decision & { userId?: string; cardId?: string }> {
  const card = await prisma.rFIDCard.findUnique({
    where: { uid: rfidUid },
    include: { user: true },
  });

  if (!card) {
    return { granted: false, reason: AccessReason.UNKNOWN_CARD, message: "Access Denied" };
  }

  if (card.user.status !== "ACTIVE") {
    return {
      granted: false,
      reason: AccessReason.USER_DISABLED,
      message: "Access Denied",
      userId: card.userId,
      cardId: card.id,
    };
  }

  if (card.status !== "ACTIVE") {
    return {
      granted: false,
      reason: AccessReason.NO_PERMISSION,
      message: "Access Denied",
      userId: card.userId,
      cardId: card.id,
    };
  }

  return {
    granted: true,
    reason: AccessReason.AUTHORIZED,
    message: "Access Granted",
    userId: card.userId,
    cardId: card.id,
  };
}

// POST /api/access — device is pre-authenticated by device.middleware.
export async function handleAccessRequest(
  device: Device & { door: Door },
  rfidUid: string,
): Promise<AccessResponse> {
  let decision: Decision & { userId?: string; cardId?: string };

  try {
    decision = await decide(rfidUid);
  } catch (err) {
    // FR-4.3/NFR-1.1: never let an unexpected error leave the door in an
    // undefined state or blow the 2s budget retrying — fail closed.
    decision = { granted: false, reason: AccessReason.SYSTEM_ERROR, message: "Access Denied" };
  }

  // FR-6.1: every attempt is logged, granted or denied.
  const log = await prisma.accessLog.create({
    data: {
      result: decision.granted ? AccessResult.GRANTED : AccessResult.DENIED,
      reason: decision.reason,
      offline: false,
      rfidUid,
      deviceId: device.id,
      doorId: device.doorId,
      userId: decision.userId,
      cardId: decision.cardId,
    },
  });

  emitAccessLogCreated(log);

  return {
    granted: decision.granted,
    unlock_duration: decision.granted ? UNLOCK_DURATION_SECONDS : 0,
    message: decision.message,
    reason: decision.reason,
  };
}

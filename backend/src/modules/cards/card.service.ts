import { EnrollmentStatus, ErrorCodes, type PaginatedResult } from "@smartdoor/shared";
import { AppError } from "../../lib/AppError";
import { prisma } from "../../lib/prisma";
import type { RFIDCard } from "../../generated/prisma";
import * as enrollmentService from "./enrollment.service";
import * as userService from "../users/user.service";
import type { CreateCardInput, UpdateCardInput } from "./card.schema";

export async function listCards(page: number, pageSize: number): Promise<PaginatedResult<RFIDCard>> {
  const [items, totalItems] = await Promise.all([
    prisma.rFIDCard.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.rFIDCard.count(),
  ]);
  return {
    items,
    pagination: { page, pageSize, totalItems, totalPages: Math.ceil(totalItems / pageSize) || 1 },
  };
}

export async function getCardOrThrow(id: string): Promise<RFIDCard> {
  const card = await prisma.rFIDCard.findUnique({ where: { id } });
  if (!card) {
    throw AppError.notFound(ErrorCodes.CARD_NOT_FOUND, "Card does not exist.");
  }
  return card;
}

// FR-2.4 (unique uid) and FR-2.2 (one card per user) are both enforced by DB
// unique constraints already (RFIDCard_uid_key, RFIDCard_userId_key). We
// pre-check here anyway so the error is a clean 409 with the right code
// instead of a raw Postgres constraint error bubbling up.
export async function createCard(input: CreateCardInput): Promise<RFIDCard> {
  await userService.getUserOrThrow(input.userId);

  const [existingUid, existingForUser] = await Promise.all([
    prisma.rFIDCard.findUnique({ where: { uid: input.uid } }),
    prisma.rFIDCard.findUnique({ where: { userId: input.userId } }),
  ]);

  if (existingUid) {
    throw AppError.conflict(ErrorCodes.CARD_ALREADY_EXISTS, "This RFID uid is already registered.");
  }
  if (existingForUser) {
    throw AppError.conflict(ErrorCodes.USER_ALREADY_HAS_CARD, "This user already has a card.");
  }

  return prisma.rFIDCard.create({ data: input });
}

export async function updateCard(id: string, input: UpdateCardInput): Promise<RFIDCard> {
  await getCardOrThrow(id);
  return prisma.rFIDCard.update({ where: { id }, data: input });
}

// Delete = DISABLED, consistent with the soft-disable pattern used for users.
export async function disableCard(id: string): Promise<RFIDCard> {
  await getCardOrThrow(id);
  return prisma.rFIDCard.update({ where: { id }, data: { status: "DISABLED" } });
}

// --- Enrollment (docs/04 Event 5, docs/05 Contract 4) ---------------------

export async function startEnrollment(userId: string) {
  await userService.getUserOrThrow(userId);

  const existing = await prisma.rFIDCard.findUnique({ where: { userId } });
  if (existing) {
    throw AppError.conflict(ErrorCodes.USER_ALREADY_HAS_CARD, "This user already has a card.");
  }

  const session = enrollmentService.startSession(userId);
  return { sessionId: session.sessionId, status: EnrollmentStatus.WAITING as const };
}

export async function confirmEnrollment(rfidUid: string) {
  const session = enrollmentService.getActiveSession();
  if (!session) {
    throw AppError.notFound(
      ErrorCodes.ENROLLMENT_SESSION_NOT_FOUND,
      "No enrollment session is currently waiting.",
    );
  }

  const existingUid = await prisma.rFIDCard.findUnique({ where: { uid: rfidUid } });
  if (existingUid) {
    enrollmentService.completeSession(session.sessionId, EnrollmentStatus.FAILED);
    // Contract 4 failure shape — returned as a 200 with a status field, not
    // an HTTP error, since this is a valid documented outcome the firmware
    // and dashboard both branch on.
    return { status: "FAILED" as const, reason: "CARD_ALREADY_EXISTS" as const };
  }

  const card = await prisma.rFIDCard.create({
    data: { uid: rfidUid, userId: session.userId },
    include: { user: true },
  });
  enrollmentService.completeSession(session.sessionId, EnrollmentStatus.SUCCESS);

  return { status: "REGISTERED" as const, user: card.user.fullName };
}

import bcrypt from "bcrypt";
import { ErrorCodes, type SystemSettings } from "@smartdoor/shared";
import { AppError } from "../../lib/AppError";
import { prisma } from "../../lib/prisma";
import type { UpdateSettingsInput, ChangePasswordInput } from "./settings.schema";

const DEFAULT_SETTINGS: SystemSettings = {
  heartbeat_interval: 60,
  unlock_duration: 5,
  emergency_cards: [],
};

async function getSetting(key: string): Promise<string | null> {
  const setting = await prisma.systemSetting.findUnique({ where: { key } });
  return setting?.value ?? null;
}

async function setSetting(key: string, value: string): Promise<void> {
  await prisma.systemSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function getSettings(): Promise<SystemSettings> {
  const [heartbeat, unlock, emergency] = await Promise.all([
    getSetting("heartbeat_interval"),
    getSetting("unlock_duration"),
    getSetting("emergency_cards"),
  ]);

  return {
    heartbeat_interval: heartbeat ? parseInt(heartbeat, 10) : DEFAULT_SETTINGS.heartbeat_interval,
    unlock_duration: unlock ? parseInt(unlock, 10) : DEFAULT_SETTINGS.unlock_duration,
    emergency_cards: emergency ? JSON.parse(emergency) : DEFAULT_SETTINGS.emergency_cards,
  };
}

export async function updateSettings(input: UpdateSettingsInput): Promise<SystemSettings> {
  if (input.heartbeat_interval !== undefined) {
    await setSetting("heartbeat_interval", input.heartbeat_interval.toString());
  }
  if (input.unlock_duration !== undefined) {
    await setSetting("unlock_duration", input.unlock_duration.toString());
  }
  return getSettings();
}

export async function changePassword(adminId: string, input: ChangePasswordInput): Promise<void> {
  const admin = await prisma.administrator.findUnique({ where: { id: adminId } });
  if (!admin) {
    throw AppError.notFound(ErrorCodes.USER_NOT_FOUND, "Administrator not found.");
  }

  const passwordMatches = await bcrypt.compare(input.currentPassword, admin.passwordHash);
  if (!passwordMatches) {
    throw AppError.unauthorized(ErrorCodes.INVALID_CREDENTIALS, "Current password is incorrect.");
  }

  const newHash = await bcrypt.hash(input.newPassword, 10);
  await prisma.administrator.update({
    where: { id: adminId },
    data: { passwordHash: newHash },
  });
}

export async function addEmergencyCard(uid: string): Promise<SystemSettings> {
  const settings = await getSettings();
  if (settings.emergency_cards.includes(uid)) {
    throw AppError.conflict(ErrorCodes.CARD_ALREADY_EXISTS, "Emergency card already exists.");
  }
  settings.emergency_cards.push(uid);
  await setSetting("emergency_cards", JSON.stringify(settings.emergency_cards));
  return settings;
}

export async function removeEmergencyCard(uid: string): Promise<SystemSettings> {
  const settings = await getSettings();
  settings.emergency_cards = settings.emergency_cards.filter((card) => card !== uid);
  await setSetting("emergency_cards", JSON.stringify(settings.emergency_cards));
  return settings;
}

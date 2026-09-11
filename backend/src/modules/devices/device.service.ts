import { randomBytes, randomUUID } from "crypto";
import { ErrorCodes, type PaginatedResult } from "@smartdoor/shared";
import { AppError } from "../../lib/AppError";
import { prisma } from "../../lib/prisma";
import type { Device, Door } from "../../generated/prisma";
import { emitDeviceConnected, emitDeviceDisconnected } from "../../websocket";
import type { HeartbeatInput, RegisterDeviceInput, UpdateDeviceInput } from "./device.schema";

const HEARTBEAT_INTERVAL_SECONDS = 60; // matches UC-10 / Event 1 default

function generateDeviceId(): string {
  return `door-${randomUUID().slice(0, 8)}`;
}

function generateDeviceToken(): string {
  return randomBytes(24).toString("hex");
}

// Contract 6: registers a device AND creates its linked Door in one step
// (backend.md: "generates device_id + device_token, and creates the linked Door").
export async function registerDevice(
  input: RegisterDeviceInput,
): Promise<{ device_id: string; device_token: string }> {
  const door = await prisma.door.create({ data: { name: input.door_name } });

  const device = await prisma.device.create({
    data: {
      deviceId: generateDeviceId(),
      deviceToken: generateDeviceToken(),
      name: input.device_name,
      doorId: door.id,
      status: "OFFLINE",
    },
  });

  return { device_id: device.deviceId, device_token: device.deviceToken };
}

export async function listDevices(
  page: number,
  pageSize: number,
): Promise<PaginatedResult<Device & { door: Door }>> {
  const [items, totalItems] = await Promise.all([
    prisma.device.findMany({
      include: { door: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.device.count(),
  ]);
  return {
    items,
    pagination: { page, pageSize, totalItems, totalPages: Math.ceil(totalItems / pageSize) || 1 },
  };
}

export async function getDeviceOrThrow(id: string): Promise<Device> {
  const device = await prisma.device.findUnique({ where: { id } });
  if (!device) {
    throw AppError.notFound(ErrorCodes.DEVICE_NOT_FOUND, "Device does not exist.");
  }
  return device;
}

export async function updateDevice(id: string, input: UpdateDeviceInput): Promise<Device> {
  await getDeviceOrThrow(id);
  return prisma.device.update({ where: { id }, data: input });
}

// FR-3.3: "Remove" a device by disabling it (soft-delete for audit trail).
export async function deleteDevice(id: string): Promise<Device> {
  await getDeviceOrThrow(id);
  return prisma.device.update({ where: { id }, data: { status: "DISABLED" } });
}

// Contract 1: called by an already-authenticated device (see device.middleware).
export async function recordHeartbeat(
  deviceRowId: string,
  input: HeartbeatInput,
): Promise<{ status: "OK"; heartbeat_interval: number }> {
  const device = await prisma.device.findUnique({ where: { id: deviceRowId } });
  if (!device) {
    throw AppError.notFound(ErrorCodes.DEVICE_NOT_FOUND, "Device not found.");
  }

  const updated = await prisma.device.update({
    where: { id: deviceRowId },
    data: {
      lastSeen: new Date(),
      status: "ONLINE",
      firmwareVersion: input.firmware_version,
    },
  });

  // Persist door state from the heartbeat (LOCKED → CLOSED, UNLOCKED → OPEN).
  const doorStatus = input.door_state === "LOCKED" ? "CLOSED" : "OPEN";
  await prisma.door.update({
    where: { id: device.doorId },
    data: { status: doorStatus },
  });

  emitDeviceConnected(updated.deviceId);

  return { status: "OK", heartbeat_interval: HEARTBEAT_INTERVAL_SECONDS };
}

// Offline detection: any ONLINE device whose lastSeen is older than 2x the
// heartbeat interval is considered stale and flipped to OFFLINE. Call this
// on an interval from server.ts.
export async function sweepStaleDevices(): Promise<string[]> {
  const staleBefore = new Date(Date.now() - HEARTBEAT_INTERVAL_SECONDS * 2 * 1000);
  const stale = await prisma.device.findMany({
    where: { status: "ONLINE", lastSeen: { lt: staleBefore } },
    select: { id: true, deviceId: true },
  });

  if (stale.length === 0) return [];

  await prisma.device.updateMany({
    where: { id: { in: stale.map((d) => d.id) } },
    data: { status: "OFFLINE" },
  });

  for (const d of stale) {
    emitDeviceDisconnected(d.deviceId);
  }

  return stale.map((d) => d.deviceId);
}

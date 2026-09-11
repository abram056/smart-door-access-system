import { type PaginatedResult, AccessReason } from "@smartdoor/shared";
import { prisma } from "../../lib/prisma";

type ListLogsQuery = {
  search?: string;
  userId?: string;
  doorId?: string;
  deviceId?: string;
  result?: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  pageSize: number;
};

type LogSyncInput = {
  logs: Array<{
    rfid_uid: string;
    timestamp: string;
    result: "GRANTED" | "DENIED";
    reason: string;
  }>;
};

export async function listLogs(query: ListLogsQuery): Promise<PaginatedResult<Record<string, unknown>>> {
  const where: Record<string, unknown> = {};

  if (query.result) {
    where.result = query.result;
  }
  if (query.userId) {
    where.userId = query.userId;
  }
  if (query.doorId) {
    where.doorId = query.doorId;
  }
  if (query.deviceId) {
    where.deviceId = query.deviceId;
  }
  if (query.dateFrom || query.dateTo) {
    where.timestamp = {
      ...(query.dateFrom && { gte: new Date(query.dateFrom) }),
      ...(query.dateTo && { lte: new Date(query.dateTo) }),
    };
  }
  if (query.search) {
    where.OR = [
      { rfidUid: { contains: query.search, mode: "insensitive" } },
      { user: { fullName: { contains: query.search, mode: "insensitive" } } },
      { door: { name: { contains: query.search, mode: "insensitive" } } },
    ];
  }

  const [items, totalItems] = await Promise.all([
    prisma.accessLog.findMany({
      where,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      orderBy: { timestamp: "desc" },
      include: {
        user: { select: { id: true, fullName: true } },
        device: { select: { id: true, name: true } },
        door: { select: { id: true, name: true } },
      },
    }),
    prisma.accessLog.count({ where }),
  ]);

  return {
    items: items.map((log) => ({
      id: log.id,
      timestamp: log.timestamp.toISOString(),
      result: log.result,
      reason: log.reason,
      offline: log.offline,
      rfidUid: log.rfidUid,
      deviceId: log.deviceId,
      doorId: log.doorId,
      userId: log.userId,
      cardId: log.cardId,
      userFullName: log.user?.fullName ?? null,
      doorName: log.door?.name ?? null,
    })),
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / query.pageSize) || 1,
    },
  };
}

export async function syncOfflineLogs(
  input: LogSyncInput,
  device: { id: string; doorId: string }
): Promise<number> {
  const data = input.logs.map((log) => ({
    rfidUid: log.rfid_uid,
    timestamp: new Date(log.timestamp),
    result: log.result as "GRANTED" | "DENIED",
    reason: log.reason as keyof typeof AccessReason,
    offline: true,
    deviceId: device.id,
    doorId: device.doorId,
  }));

  await prisma.accessLog.createMany({ data });
  return data.length;
}

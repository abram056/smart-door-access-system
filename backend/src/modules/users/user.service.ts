import { ErrorCodes, type PaginatedResult } from "@smartdoor/shared";
import { AppError } from "../../lib/AppError";
import { prisma } from "../../lib/prisma";
import type { User } from "../../generated/prisma";
import type { CreateUserInput, ListUsersQuery, UpdateUserInput } from "./user.schema";

export async function createUser(input: CreateUserInput): Promise<User> {
  return prisma.user.create({ data: input });
}

export async function listUsers(query: ListUsersQuery): Promise<PaginatedResult<User>> {
  const where = query.status ? { status: query.status } : {};
  const [items, totalItems] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / query.pageSize) || 1,
    },
  };
}

export async function getUserOrThrow(id: string): Promise<User> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw AppError.notFound(ErrorCodes.USER_NOT_FOUND, "User does not exist.");
  }
  return user;
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<User> {
  await getUserOrThrow(id);
  return prisma.user.update({ where: { id }, data: input });
}

// "Delete" is a soft-disable (FR-1.3 + NFR data-integrity note in backend.md):
// access history must stay intact for the audit log, so we never hard-delete.
export async function disableUser(id: string): Promise<User> {
  await getUserOrThrow(id);
  return prisma.user.update({ where: { id }, data: { status: "INACTIVE" } });
}

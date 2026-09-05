// Matches prisma/schema.prisma User model
// NOTE: username/password login belongs to the separate Administrator model,
// not User. A "User" here is a badge-holder (FR-1.x), not someone who logs in.

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface User {
  id: string;
  fullName: string;
  email?: string | null;
  role: string; // free text per Prisma (defaults "STAFF"); not a closed enum
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  fullName: string;
  email?: string;
  role?: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  role?: string;
  status?: UserStatus;
}

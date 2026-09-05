// Matches prisma/schema.prisma Administrator model
// This did not exist in shared/ before, but auth.middleware/login need it.

export interface Administrator {
  id: string;
  username: string;
  role: string; // e.g. "ADMIN"; stretch: SUPER_ADMIN/ADMIN/VIEWER
  createdAt: string;
  updatedAt: string;
  // passwordHash intentionally omitted — never sent to clients
}

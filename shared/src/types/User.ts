export enum UserRole {
    ADMIN = "ADMIN",
    STAFF = "STAFF",
    GUEST = "GUEST"
}

export interface User {
    id: string;

    username: string;

    fullName: string;

    email?: string;

    role: UserRole;

    isActive: boolean;

    createdAt: Date;

    updatedAt: Date;
}
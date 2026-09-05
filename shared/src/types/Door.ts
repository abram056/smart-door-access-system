// Matches prisma/schema.prisma Door model

export enum DoorStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export interface Door {
  id: string;
  name: string;
  location?: string | null;
  status: DoorStatus;
}

// Matches prisma/schema.prisma RFIDCard model

export enum CardStatus {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
  LOST = "LOST",
}

export interface RFIDCard {
  id: string;
  uid: string;
  status: CardStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardRequest {
  uid: string;
  userId: string;
}

export interface UpdateCardRequest {
  status?: CardStatus;
}

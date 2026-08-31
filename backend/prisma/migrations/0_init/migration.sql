-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('ACTIVE', 'DISABLED', 'LOST');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ONLINE', 'OFFLINE', 'DISABLED');

-- CreateEnum
CREATE TYPE "DoorStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "AccessResult" AS ENUM ('GRANTED', 'DENIED');

-- CreateEnum
CREATE TYPE "AccessReason" AS ENUM ('AUTHORIZED', 'UNKNOWN_CARD', 'NO_PERMISSION', 'USER_DISABLED', 'DEVICE_DISABLED', 'OFFLINE_CACHE', 'SYSTEM_ERROR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STAFF',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RFIDCard" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "status" "CardStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RFIDCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "deviceToken" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "firmwareVersion" TEXT,
    "status" "DeviceStatus" NOT NULL DEFAULT 'OFFLINE',
    "lastSeen" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "doorId" TEXT NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Door" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "status" "DoorStatus" NOT NULL DEFAULT 'CLOSED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Door_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessLog" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" "AccessResult" NOT NULL,
    "reason" "AccessReason" NOT NULL,
    "offline" BOOLEAN NOT NULL DEFAULT false,
    "rfidUid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceId" TEXT,
    "doorId" TEXT,
    "userId" TEXT,
    "cardId" TEXT,

    CONSTRAINT "AccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Administrator" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Administrator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RFIDCard_uid_key" ON "RFIDCard"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "RFIDCard_userId_key" ON "RFIDCard"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_deviceId_key" ON "Device"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_doorId_key" ON "Device"("doorId");

-- CreateIndex
CREATE INDEX "AccessLog_timestamp_idx" ON "AccessLog"("timestamp");

-- CreateIndex
CREATE INDEX "AccessLog_deviceId_idx" ON "AccessLog"("deviceId");

-- CreateIndex
CREATE INDEX "AccessLog_userId_idx" ON "AccessLog"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Administrator_username_key" ON "Administrator"("username");

-- AddForeignKey
ALTER TABLE "RFIDCard" ADD CONSTRAINT "RFIDCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_doorId_fkey" FOREIGN KEY ("doorId") REFERENCES "Door"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessLog" ADD CONSTRAINT "AccessLog_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessLog" ADD CONSTRAINT "AccessLog_doorId_fkey" FOREIGN KEY ("doorId") REFERENCES "Door"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessLog" ADD CONSTRAINT "AccessLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessLog" ADD CONSTRAINT "AccessLog_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "RFIDCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;


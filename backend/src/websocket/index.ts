import type { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { AccessEvents, DeviceEvents } from "@smartdoor/shared";

let io: SocketIOServer | undefined;

export function initWebsocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: { origin: "*" }, // prototype-scope; tighten before anything real
  });
  return io;
}

function getIO(): SocketIOServer {
  if (!io) {
    throw new Error("initWebsocket() must be called before emitting events.");
  }
  return io;
}

export function emitDeviceConnected(deviceId: string) {
  getIO().emit(DeviceEvents.CONNECTED, { deviceId });
}

export function emitDeviceDisconnected(deviceId: string) {
  getIO().emit(DeviceEvents.DISCONNECTED, { deviceId });
}

export function emitAccessLogCreated(log: unknown) {
  getIO().emit(AccessEvents.LOG_CREATED, log);
}

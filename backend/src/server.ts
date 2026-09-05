import { createServer } from "http";
import { createApp } from "./app";
import { env } from "./config/env";
import { initWebsocket } from "./websocket";
import { sweepStaleDevices } from "./modules/devices/device.service";

const app = createApp();
const httpServer = createServer(app);

initWebsocket(httpServer);

// NFR-2.x / UC-10: flip devices to OFFLINE if their heartbeat has gone stale.
// Runs independently of any single request.
const SWEEP_INTERVAL_MS = 30_000;
setInterval(() => {
  sweepStaleDevices().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Stale device sweep failed:", err);
  });
}, SWEEP_INTERVAL_MS);

httpServer.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Smart Door Access API listening on port ${env.port}`);
});

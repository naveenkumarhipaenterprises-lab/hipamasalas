import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { registerSeoRoutes } from "./seoRoutes";
import { serveStatic } from "./_core/vite";
import { setupVite } from "./_core/vite-dev";

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  registerSeoRoutes(app);
  return app;
}

const app = createApp();
export default app;

async function startServer() {
  const server = createServer(app);
  if (process.env.NODE_ENV === "development") await setupVite(app, server);
  else serveStatic(app);
  const port = Number(process.env.PORT || 3000);
  server.once("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. Choose another port, for example: PORT=3001 npm run dev`);
    } else {
      console.error("The server could not start:", error.message);
    }
    process.exitCode = 1;
  });
  server.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

if (process.env.VERCEL) {
  serveStatic(app);
} else {
  startServer().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

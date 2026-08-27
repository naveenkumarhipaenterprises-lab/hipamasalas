import "dotenv/config";
import { createServer } from "node:http";
import { createApp } from "./app";
import { serveStatic } from "./_core/vite";
import { setupVite } from "./_core/vite-dev";

export { createApp } from "./app";

const app = createApp();

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

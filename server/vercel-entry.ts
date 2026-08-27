import { createApp } from "./app";
import { serveStatic } from "./_core/vite";

const app = createApp();
serveStatic(app);

export default app;

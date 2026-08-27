import type { IncomingMessage, ServerResponse } from "node:http";
import app from "../server/index";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req, res);
}

import { execFile as baseExecFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const execFile = promisify(baseExecFile);

export function getIconsDir() {
  return join(__dirname, "../../react-icons");
}

export function getPackageDir() {
  return join(__dirname, "../icons");
}

export function getDistDir() {
  return join(__dirname, "../../dist");
}

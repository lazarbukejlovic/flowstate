import path from "path";
import { defineConfig } from "prisma/config";

// Load .env.local for CLI commands (Next.js doesn't auto-load it for Prisma)
try {
  const fs = require("fs");
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  }
} catch {
  // Ignore if can't load
}

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});

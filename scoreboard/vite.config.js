import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Copy players/index.json into public/players/ before build
function copyPlayersData() {
  const src = join(__dirname, "../players/index.json");
  const destDir = join(__dirname, "public/players");
  const dest = join(destDir, "index.json");
  if (existsSync(src)) {
    mkdirSync(destDir, { recursive: true });
    copyFileSync(src, dest);
  }
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-players-data",
      buildStart() {
        copyPlayersData();
      },
    },
  ],
  base: process.env.VITE_BASE_PATH || "/",
  build: {
    outDir: "docs",
    copyPublicDir: true,
  },
  publicDir: "public",
});

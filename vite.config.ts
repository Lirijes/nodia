import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Var /api-anrop ska skickas vidare.
// Lokalt (npm run dev): backend på http://localhost:5131.
// I Docker sätts API_PROXY_TARGET=http://backend:8080 i compose.yaml.
const apiProxyTarget = process.env.API_PROXY_TARGET ?? "http://localhost:5131";

// I Docker på Windows kommer filändringar inte fram som händelser,
// så där slås polling på via WATCH_POLLING=true.
const usePolling = process.env.WATCH_POLLING === "true";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
    watch: usePolling ? { usePolling: true, interval: 300 } : undefined,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

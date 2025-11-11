import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), cloudflare(), tailwindcss()],
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  },
  optimizeDeps: {
    include: ["react", "react-router"],
  },
  define: {
    global: "globalThis",
  },
});

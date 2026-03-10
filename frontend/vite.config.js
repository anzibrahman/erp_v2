// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),        // React plugin
    tailwindcss(),  // Tailwind v4 plugin
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000", // your Express backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

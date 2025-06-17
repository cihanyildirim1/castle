import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // intercept any requests to /sparql and forward to Wikidata
      "/sparql": {
        target: "https://query.wikidata.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sparql/, "/sparql"),
      },
    },
  },
  base: process.env.VITE_BASE_PATH || "/castle"
});

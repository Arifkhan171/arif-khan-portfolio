import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { site } from "./scripts/vite-plugin-site.ts";

// The headers of the "/(.*)" rule in vercel.json, so `vite preview` serves the real CSP too.
const vercel = JSON.parse(readFileSync(new URL("./vercel.json", import.meta.url), "utf8")) as {
  headers: { source: string; headers: { key: string; value: string }[] }[];
};
const previewHeaders = Object.fromEntries(
  (vercel.headers.find((rule) => rule.source === "/(.*)")?.headers ?? []).map((h) => [
    h.key,
    h.value,
  ]),
);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), site()],
  build: {
    // Every supported browser has <link rel="modulepreload">; the polyfill only costs bytes.
    modulePreload: { polyfill: false },
  },
  preview: { headers: previewHeaders },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

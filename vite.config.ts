import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  // vinext uses standard Vite + Next App Router plugins

  plugins: [
    vinext(),
    cloudflare(),
  ],
});

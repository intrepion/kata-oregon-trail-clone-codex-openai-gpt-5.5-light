import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    rollupOptions: {
      input: resolve(__dirname, "dev.html")
    }
  },
  test: {
    include: ["tests/unit/**/*.test.ts"]
  }
});

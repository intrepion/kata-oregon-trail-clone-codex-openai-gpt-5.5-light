import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  webServer: {
    command: "npm run dev -- --port 4397 --strictPort",
    url: "http://127.0.0.1:4397",
    reuseExistingServer: false
  },
  use: {
    baseURL: "http://127.0.0.1:4397",
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});

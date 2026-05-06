const { defineConfig, devices } = require("@playwright/test");

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3100";

module.exports = defineConfig({
  testDir: "./tests/e2e",
  timeout: 90 * 1000,
  expect: {
    timeout: 20 * 1000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    channel: "chrome",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 950 } },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: [
    {
      command: "npm run mock:api",
      url: "http://127.0.0.1:5050/hms/schema",
      reuseExistingServer: !process.env.CI,
      timeout: 60 * 1000,
    },
    {
      command: "npm run start:e2e",
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
});

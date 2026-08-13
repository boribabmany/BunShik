// @ts-check
const { defineConfig, devices } = require("@playwright/test");

/**
 * 고객 키오스크(kiosk-customer) E2E 설정
 *
 * 전제 조건 (직접 실행):
 *  1. 로컬 MySQL에 bunshik_db 스키마/시드 적용 (bunshik_db_local_setup.sql)
 *  2. bunshik-back 이 로컬 MySQL을 바라보도록 .env 구성 후 :8080 으로 기동
 *  3. 아래 webServer 설정이 kiosk-customer 를 :3001 에서 자동으로 띄움
 *     (백엔드는 자동 기동하지 않음 — 직접 먼저 켜두어야 함)
 */
module.exports = defineConfig({
  testDir: "./e2e/tests",
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  retries: 1,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: "http://localhost:3001",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm start",
    url: "http://localhost:3001",
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      PORT: "3001",
      BROWSER: "none",
      // 로컬 백엔드(:8080)를 바라보도록 강제 — .env 파일은 건드리지 않음
      REACT_APP_API_BASE_URL: "http://localhost:8080",
    },
  },
});

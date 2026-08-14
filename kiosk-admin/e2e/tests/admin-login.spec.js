const { test, expect } = require("@playwright/test");

test.describe("관리자 로그인", () => {
  test("로그인하지 않은 사용자는 로그인 화면으로 이동한다", async ({ page }) => {
    await page.goto("/adminorder");

    await expect(page).toHaveURL(/\/adminlogin$/);
    await expect(page.getByRole("heading", { name: "관리자 로그인" })).toBeVisible();
  });

  test("정상 로그인 후 관리자 메뉴로 이동한다", async ({ page }) => {
    // 관리자 메뉴 진입 직후 발생하는 부가 API도 실제 백엔드로 나가지 않게 한다.
    await page.route("**/api/admin/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [] }),
      }),
    );
    await page.route("**/api/admin/login", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: { accessToken: "e2e-admin-token" } }),
      }),
    );
    await page.route("**/api/admin/menus", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [] }) }),
    );
    await page.route("**/api/admin/options", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [] }) }),
    );
    await page.route("**/api/admin/orders", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [] }) }),
    );

    await page.goto("/adminlogin");
    await page.getByPlaceholder("아이디 입력").fill("admin");
    await page.getByPlaceholder("비밀번호 입력").fill("password123");
    await page.getByRole("button", { name: "로그인" }).click();

    await expect(page).toHaveURL(/\/adminmenu$/);
    await expect(page.getByRole("heading", { name: "관리자 메뉴 관리" })).toBeVisible();
    await expect.poll(() => page.evaluate(() => sessionStorage.getItem("accessToken"))).toBe("e2e-admin-token");
  });
});

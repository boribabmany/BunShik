const { test, expect } = require("@playwright/test");

test.describe("관리자 메뉴 관리", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem("accessToken", "e2e-admin-token");
      sessionStorage.setItem("isAdminLoggedIn", "true");
    });
  });

  test("메뉴를 등록하고 수정한 뒤 판매를 중단한다", async ({ page }) => {
    let menuName = "E2E 테스트 메뉴";
    let menuCreated = false;
    let menuVisible = true;

    const menuResponse = () => ({
      menuId: 501,
      menuName,
      menuNameEn: "E2E Test Menu",
      menuType: "NORMAL",
      category: "김밥",
      price: 5000,
      imageUrl: "/images/e2e-menu.png",
      effectiveAvailable: true,
      isAvailable: true,
      isVisible: menuVisible,
      description: "E2E 등록 메뉴",
      descriptionEn: "Created by E2E",
    });

    await page.route("**/api/admin/**", async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      const method = request.method();

      if (url.pathname === "/api/admin/menus" && method === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: menuCreated ? [menuResponse()] : [] }),
        });
      }

      if (url.pathname === "/api/admin/menus" && method === "POST") {
        menuCreated = true;
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: 501 }),
        });
      }

      if (url.pathname === "/api/admin/menus/501" && method === "PUT") {
        menuName = "E2E 수정 메뉴";
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: 501 }),
        });
      }

      if (url.pathname === "/api/admin/menus/501/stop" && method === "PATCH") {
        menuVisible = false;
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: null }),
        });
      }

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [] }),
      });
    });

    await page.goto("/adminmenuedit");
    await expect(page.getByRole("heading", { name: "관리자 메뉴 수정 및 등록" })).toBeVisible();

    await page.getByRole("button", { name: "+ 메뉴 등록" }).click();
    await page.locator('input[name="menu_name"]').fill(menuName);
    await page.locator('input[name="menu_name_en"]').fill("E2E Test Menu");
    await page.locator('select[name="category"]').selectOption("김밥");
    await page.locator('input[name="description"]').fill("E2E 등록 메뉴");
    await page.locator('input[name="description_en"]').fill("Created by E2E");
    await page.locator('input[name="price"]').fill("5000");
    await page.locator('input[type="file"]').setInputFiles({
      name: "e2e-menu.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        "base64",
      ),
    });

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "메뉴 등록", exact: true }).click();

    let menuRow = page.locator("tr").filter({ hasText: "E2E 테스트 메뉴" });
    await expect(menuRow).toBeVisible();
    await menuRow.getByRole("button", { name: "수정" }).click();
    await page.locator('input[name="menu_name"]').fill("E2E 수정 메뉴");

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "메뉴 정보 수정" }).click();

    menuRow = page.locator("tr").filter({ hasText: "E2E 수정 메뉴" });
    await expect(menuRow).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await menuRow.getByRole("button", { name: "판매중단" }).click();
    await expect(menuRow).toContainText("판매중단");
    await expect(menuRow.getByRole("button", { name: "판매재개" })).toBeVisible();
  });
});

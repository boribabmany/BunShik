const { test, expect } = require("@playwright/test");

const order = {
  orderId: 101,
  orderNumber: "E2E-101",
  createdAt: "2026-08-14T10:30:00",
  orderType: "매장",
  paymentMethod: "카드",
  orderStatus: "접수",
  totalPrice: 8500,
};

test.describe("관리자 주문 처리", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem("accessToken", "e2e-admin-token");
      sessionStorage.setItem("isAdminLoggedIn", "true");
    });
  });

  test("주문 상세 확인 후 접수에서 완료까지 상태를 변경한다", async ({ page }) => {
    let currentStatus = "접수";

    await page.route("**/api/admin/orders", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [{ ...order, orderStatus: currentStatus }] }),
      }),
    );
    await page.route("**/api/admin/orders/101/detail", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            ...order,
            orderStatus: currentStatus,
            items: [
              {
                orderItemId: 1,
                menuId: 1,
                menuName: "참치김밥",
                quantity: 1,
                unitPrice: 4500,
                components: [],
                options: [],
              },
            ],
          },
        }),
      }),
    );
    await page.route("**/api/admin/orders/101/status", async (route) => {
      const request = route.request().postDataJSON();
      currentStatus = request.orderStatus;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: null }),
      });
    });

    await page.goto("/adminorder");
    const orderRow = page.locator("tr.order-row").filter({ hasText: "E2E-101" });
    await expect(orderRow).toContainText("접수");

    await orderRow.click();
    await expect(page.getByText("주문 상세", { exact: true })).toBeVisible();
    await expect(page.getByText("참치김밥")).toBeVisible();

    await orderRow.getByRole("button", { name: "조리 시작" }).click();
    await expect(orderRow).toContainText("조리중");

    await orderRow.getByRole("button", { name: "조리 완료" }).click();
    await expect(orderRow).toContainText("완료");
    await expect(orderRow.getByRole("button", { name: "완료됨" })).toBeDisabled();
  });

  test("접수 주문 여러 건을 선택해 한 번에 조리를 시작한다", async ({ page }) => {
    let currentStatus = "접수";
    const orders = [
      order,
      { ...order, orderId: 102, orderNumber: "E2E-102" },
    ];

    await page.route("**/api/admin/orders", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: orders.map((item) => ({
            ...item,
            orderStatus: currentStatus,
          })),
        }),
      }),
    );
    await page.route("**/api/admin/orders/bulk/status", async (route) => {
      currentStatus = route.request().postDataJSON().orderStatus;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: 2 }),
      });
    });

    await page.goto("/adminorder");
    await page.locator(".search-area select").nth(1).selectOption("접수");
    await page.getByLabel("현재 화면 주문 전체 선택").check();
    await expect(page.getByText("선택 2건")).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "선택 주문 조리 시작" }).click();

    await expect(page.locator("tr.order-row").filter({ hasText: "E2E-101" }))
      .toHaveCount(0);
    await expect(page.locator("tr.order-row").filter({ hasText: "E2E-102" }))
      .toHaveCount(0);
  });

  test("접수와 조리중 주문을 함께 선택해 한 번에 취소한다", async ({ page }) => {
    let canceled = false;
    let cancelPayload;
    const orders = [
      order,
      { ...order, orderId: 102, orderNumber: "E2E-102" },
    ];

    await page.route("**/api/admin/orders", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: orders.map((item) => ({
            ...item,
            orderStatus: canceled
              ? "취소"
              : item.orderId === 101 ? "접수" : "조리중",
          })),
        }),
      }),
    );
    await page.route("**/api/admin/orders/bulk/cancel", async (route) => {
      cancelPayload = route.request().postDataJSON();
      canceled = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: 2 }),
      });
    });

    await page.goto("/adminorder");
    await page.getByLabel("E2E-101 주문 선택").check();
    await page.getByLabel("E2E-102 주문 선택").check();

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "선택 주문 취소" }).click();

    await expect.poll(() => cancelPayload).toEqual({ orderIds: [101, 102] });
    await expect(page.locator("tr.order-row").filter({ hasText: "E2E-101" }))
      .toContainText("취소");
    await expect(page.locator("tr.order-row").filter({ hasText: "E2E-102" }))
      .toContainText("취소");
    await expect(page.getByText("선택 0건")).toBeVisible();
  });
});

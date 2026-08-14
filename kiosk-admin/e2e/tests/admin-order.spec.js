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
});

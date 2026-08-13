// @ts-check
const { test, expect } = require("@playwright/test");
const { payAndWaitForCompletion } = require("./helpers");

/**
 * 포장 주문 흐름 E2E
 * customer-flow.spec.js(매장식사)와 로직은 동일하고 홈 화면 선택 버튼만 다르다.
 * orderApi.createOrder 호출 시 order_type이 "포장"으로 전달되는지는
 * 백엔드 orders.order_type 컬럼 값으로 최종 검증된다(주문완료 화면엔 별도 표시가 없음).
 */

const PLAIN_MENU_NAME = "참치김밥";

test.describe("고객 키오스크 - 포장 주문 전체 흐름", () => {
  test("포장 선택부터 결제 완료까지", async ({ page }) => {
    // 1. 홈 화면 접속 → 포장하기 선택
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: /포장.*하기/s }),
    ).toBeVisible();
    await page.getByRole("button", { name: /포장.*하기/s }).click();

    // 2. 메뉴 화면 → 옵션 없는 메뉴 담기
    await expect(page).toHaveURL(/\/menu$/);
    const menuCard = page
      .locator(".menu-card")
      .filter({ hasText: PLAIN_MENU_NAME });
    await expect(menuCard).toBeVisible({ timeout: 15_000 });
    await menuCard.locator(".menu-card-add-btn").click();

    await expect(page.locator(".menu-cartbar-count")).toHaveText("1개");
    await page.locator(".menu-cartbar-confirm").click();

    // 3. 장바구니 → 결제 하기
    await expect(page).toHaveURL(/\/cart$/);
    await page.locator(".cart-confirm-button").click();

    // 4. 결제 → 카드결제 (실패 시 자동 재시도)
    await expect(page).toHaveURL(/\/payment$/);
    await payAndWaitForCompletion(page);

    // 5. 주문완료 검증
    await expect(page).toHaveURL(/\/complete$/);
    await expect(page.locator(".complete-order-number")).not.toBeEmpty();
  });
});

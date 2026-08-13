// @ts-check
const { test, expect } = require("@playwright/test");
const { payAndWaitForCompletion } = require("./helpers");

/**
 * 고객 키오스크 핵심 흐름 E2E
 * 홈(매장식사 선택) → 메뉴(옵션 없는 메뉴 담기) → 장바구니 → 결제(카드결제) → 주문완료
 *
 * 전제:
 *  - 로컬 MySQL에 bunshik_db_local_setup.sql 적용 완료 (김밥 메뉴 존재)
 *  - bunshik-back 이 로컬 MySQL을 바라보며 :8080 에서 기동 중
 *
 * 참고: 결제(카드결제)는 백엔드에서 실제로 확률 시뮬레이션됨
 * (성공 90% / 승인거절 6% / 카드오류 2% / 지연 2% - PaymentService.simulatePayment)
 * 승인거절·지연은 재시도 가능해서 최대 3회까지 자동 재시도한다 (helpers.payAndWaitForCompletion).
 */

const PLAIN_MENU_NAME = "참치김밥"; // 옵션/세트 없는 단품 메뉴 — OptionModal·SetMenuModal 없이 바로 담김
// 실제 DB엔 "김밥음료세트"/"야채김밥"/"참치김밥"처럼 이름에 "김밥"이 겹치는 메뉴가 여러 개 있어서
// .filter({ hasText })가 strict mode 위반(여러 개 매칭)을 내지 않도록 겹치지 않는 이름을 사용한다.

test.describe("고객 키오스크 - 매장식사 주문 전체 흐름", () => {
  test("메뉴 선택부터 결제 완료까지", async ({ page }) => {
    // 1. 홈 화면 접속 → 매장식사 선택
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: /매장.*식사/s }),
    ).toBeVisible();
    await page.getByRole("button", { name: /매장.*식사/s }).click();

    // 2. 메뉴 화면 → 옵션 없는 메뉴(참치김밥) 카드에서 담기 버튼 클릭
    await expect(page).toHaveURL(/\/menu$/);
    const menuCard = page
      .locator(".menu-card")
      .filter({ hasText: PLAIN_MENU_NAME });
    await expect(menuCard).toBeVisible({ timeout: 15_000 });
    await menuCard.locator(".menu-card-add-btn").click();

    // 장바구니 카운트 1로 반영 확인 후 하단 바에서 주문 확인으로 이동
    await expect(page.locator(".menu-cartbar-count")).toHaveText("1개");
    await page.locator(".menu-cartbar-confirm").click();

    // 3. 장바구니 화면 → 담긴 메뉴 확인 후 결제 하기
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.locator(".cart-list")).toContainText(PLAIN_MENU_NAME);
    await page.locator(".cart-confirm-button").click();

    // 4. 결제 화면 → 결제 수단 선택 → 카드결제 (실패 시 자동 재시도)
    await expect(page).toHaveURL(/\/payment$/);
    await payAndWaitForCompletion(page);

    // 5. 주문완료 화면 검증
    await expect(page).toHaveURL(/\/complete$/);
    await expect(page.getByText("주문이 완료되었습니다!")).toBeVisible();
    await expect(page.locator(".complete-order-label")).toHaveText("주문번호");
    await expect(page.locator(".complete-order-number")).not.toBeEmpty();
  });
});

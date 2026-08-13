// @ts-check
const { test, expect } = require("../fixtures/pages");

/**
 * 고객 키오스크 핵심 흐름 E2E
 * 홈(매장식사 선택) → 메뉴(옵션 없는 메뉴 담기) → 장바구니 → 결제(카드결제) → 주문완료
 *
 * 전제:
 *  - 로컬 MySQL에 메뉴 시드가 있고, "참치김밥"처럼 옵션·세트 없는 단품이 존재해야 한다.
 *  - bunshik-back 이 로컬 MySQL을 바라보며 :8080 에서 기동 중이어야 한다.
 */

const PLAIN_MENU_NAME = "참치김밥";

test.describe("고객 키오스크 - 매장식사 주문 전체 흐름", () => {
  test("메뉴 선택부터 결제 완료까지", async ({
    homePage,
    menuPage,
    cartPage,
    paymentPage,
    completePage,
  }) => {
    await homePage.goto();
    await homePage.selectDineIn();

    await expect(homePage.page).toHaveURL(/\/menu$/);
    await menuPage.addPlainItem(PLAIN_MENU_NAME);
    await menuPage.expectCartCount(1);
    await menuPage.goToCart();

    await cartPage.expectContains(PLAIN_MENU_NAME);
    await cartPage.checkout();

    await paymentPage.payWithCard();

    await completePage.expectOrderCompleted();
  });
});

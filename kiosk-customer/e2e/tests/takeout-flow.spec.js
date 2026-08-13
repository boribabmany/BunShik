// @ts-check
const { test, expect } = require("../fixtures/pages");

/**
 * 포장 주문 흐름 E2E — customer-flow.spec.js(매장식사)와 로직은 동일하고
 * 홈 화면 선택 버튼만 다르다.
 */

const PLAIN_MENU_NAME = "참치김밥";

test.describe("고객 키오스크 - 포장 주문 전체 흐름", () => {
  test("포장 선택부터 결제 완료까지", async ({
    homePage,
    menuPage,
    cartPage,
    paymentPage,
    completePage,
  }) => {
    await homePage.goto();
    await homePage.selectTakeout();

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

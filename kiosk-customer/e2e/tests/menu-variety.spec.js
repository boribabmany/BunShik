// @ts-check
const { test, expect } = require("../fixtures/pages");

/**
 * 옵션 메뉴 / 세트 메뉴 담기 흐름 E2E
 * customer-flow.spec.js는 옵션·세트가 전혀 없는 단품(참치김밥)만 다루므로,
 * OptionModal / SetMenuModal 컴포넌트를 실제로 타는 경로를 별도로 검증한다.
 *
 * 메뉴 이름(라면/김밥음료세트)은 kiosk-admin 시드 이미지 기준 추정이라,
 * 실제 DB의 메뉴명이 다르면 아래 상수만 바꿔주면 된다.
 */

const OPTION_MENU_NAME = "라면"; // 옵션(토핑: 치즈/계란/라면사리)이 있는 단품
const SET_MENU_NAME = "김밥음료세트"; // 그룹 선택이 필요한 세트 메뉴

test.describe("고객 키오스크 - 옵션/세트 메뉴 담기", () => {
  test("옵션 있는 메뉴(라면) 담기 → 결제 완료", async ({
    homePage,
    menuPage,
    cartPage,
    paymentPage,
    completePage,
  }) => {
    await homePage.goto();
    await homePage.selectDineIn();
    await expect(homePage.page).toHaveURL(/\/menu$/);

    await menuPage.addItemWithOptions(OPTION_MENU_NAME);
    await menuPage.expectCartCount(1);
    await menuPage.goToCart();

    await cartPage.expectContains(OPTION_MENU_NAME);
    await cartPage.checkout();

    await paymentPage.payWithCard();

    await completePage.expectOrderCompleted();
  });

  test("세트 메뉴(김밥음료세트) 담기 → 결제 완료", async ({
    homePage,
    menuPage,
    cartPage,
    paymentPage,
    completePage,
  }) => {
    await homePage.goto();
    await homePage.selectDineIn();
    await expect(homePage.page).toHaveURL(/\/menu$/);

    await menuPage.addSetMenuItem(SET_MENU_NAME);
    await menuPage.expectCartCount(1);
    await menuPage.goToCart();

    await cartPage.expectContains(SET_MENU_NAME);
    await cartPage.checkout();

    await paymentPage.payWithCard();

    await completePage.expectOrderCompleted();
  });
});

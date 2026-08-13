// @ts-check
const { test, expect } = require("@playwright/test");
const {
  payAndWaitForCompletion,
  selectFirstAvailableInEachGroup,
} = require("./helpers");

/**
 * 옵션 메뉴 / 세트 메뉴 담기 흐름 E2E
 * customer-flow.spec.js는 옵션·세트가 전혀 없는 단품(참치김밥)만 다루므로,
 * OptionModal / SetMenuModal 컴포넌트를 실제로 타는 경로를 별도로 검증한다.
 *
 * 그룹(맛/구성 선택) 후보 중 어떤 걸 고르는지는 중요하지 않으므로
 * 매번 "선택 가능한 첫 번째 항목"을 고른다 (selectFirstAvailableInEachGroup).
 * 실제 DB의 메뉴 구성(그룹 개수·이름)이 팀마다 다를 수 있어 이름을 하드코딩하지 않는다.
 *
 * 메뉴 이름(라면/김밥음료세트)은 kiosk-admin 시드 이미지(ramen.jpg 등) 기준 추정이라,
 * 실제 DB의 메뉴명이 다르면 아래 상수만 바꿔주면 된다.
 */

const OPTION_MENU_NAME = "라면"; // 옵션(토핑: 치즈/계란/라면사리)이 있는 단품
const SET_MENU_NAME = "김밥음료세트"; // 그룹 선택이 필요한 세트 메뉴

test.describe("고객 키오스크 - 옵션/세트 메뉴 담기", () => {
  test("옵션 있는 메뉴(라면) 담기 → 결제 완료", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /매장.*식사/s }).click();
    await expect(page).toHaveURL(/\/menu$/);

    const menuCard = page
      .locator(".menu-card")
      .filter({ hasText: OPTION_MENU_NAME });
    await expect(menuCard).toBeVisible({ timeout: 15_000 });
    await menuCard.locator(".menu-card-add-btn").click();

    const modal = page.locator(".option-modal");
    const opened = await modal
      .waitFor({ state: "visible", timeout: 5_000 })
      .then(() => true)
      .catch(() => false);

    if (opened) {
      // 그룹(맛 선택 등)이 있다면 그룹마다 첫 번째 선택지를 고른다
      await selectFirstAvailableInEachGroup(modal, ".option-modal-group");

      // 토핑(선택)이 있다면 첫 번째 토핑을 하나 추가한다
      const firstTopping = modal
        .locator(".option-card-toggle-btn:not([disabled])")
        .first();
      if (await firstTopping.count()) {
        await firstTopping.click();
      }

      await modal.locator(".option-modal-submit-button").click();
    }
    // 그룹/토핑이 전혀 없는 메뉴라면 모달 없이 바로 담긴 것 — 그대로 진행

    await expect(page.locator(".menu-cartbar-count")).toHaveText("1개");
    await page.locator(".menu-cartbar-confirm").click();

    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.locator(".cart-list")).toContainText(OPTION_MENU_NAME);
    await page.locator(".cart-confirm-button").click();

    await expect(page).toHaveURL(/\/payment$/);
    await payAndWaitForCompletion(page);

    await expect(page).toHaveURL(/\/complete$/);
    await expect(page.locator(".complete-order-number")).not.toBeEmpty();
  });

  test("세트 메뉴(김밥음료세트) 담기 → 결제 완료", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /매장.*식사/s }).click();
    await expect(page).toHaveURL(/\/menu$/);

    const menuCard = page
      .locator(".menu-card")
      .filter({ hasText: SET_MENU_NAME });
    await expect(menuCard).toBeVisible({ timeout: 15_000 });
    await menuCard.locator(".menu-card-add-btn").click();

    const modal = page.locator(".set-modal");
    await expect(modal).toBeVisible({ timeout: 5_000 });

    await selectFirstAvailableInEachGroup(modal, ".set-modal-group");
    await modal.locator(".set-modal-submit-button").click();

    await expect(page.locator(".menu-cartbar-count")).toHaveText("1개");
    await page.locator(".menu-cartbar-confirm").click();

    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.locator(".cart-list")).toContainText(SET_MENU_NAME);
    await page.locator(".cart-confirm-button").click();

    await expect(page).toHaveURL(/\/payment$/);
    await payAndWaitForCompletion(page);

    await expect(page).toHaveURL(/\/complete$/);
    await expect(page.locator(".complete-order-number")).not.toBeEmpty();
  });
});

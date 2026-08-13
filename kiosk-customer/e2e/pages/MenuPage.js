// @ts-check
const { expect } = require("@playwright/test");

/**
 * 그룹(맛/구성 선택) 후보 중 어떤 걸 고르는지는 중요하지 않으므로
 * 매번 "선택 가능한 첫 번째 항목"을 고른다. 실제 DB의 메뉴 구성이 팀마다 달라도
 * 이름을 하드코딩하지 않아 그대로 동작한다.
 */
async function selectFirstAvailableInEachGroup(modal, groupSelector) {
  const groups = modal.locator(groupSelector);
  const count = await groups.count();

  for (let i = 0; i < count; i += 1) {
    const group = groups.nth(i);
    const button = group.locator("button:not([disabled])").first();
    await expect(button).toBeVisible();
    await button.click();
  }
}

class MenuPage {
  constructor(page) {
    this.page = page;
  }

  card(menuName) {
    return this.page.locator(".menu-card").filter({ hasText: menuName });
  }

  /** 옵션/세트 없이 담기 버튼 클릭만으로 바로 장바구니에 담기는 단품 메뉴 */
  async addPlainItem(menuName) {
    await expect(this.card(menuName)).toBeVisible({ timeout: 15_000 });
    await this.card(menuName).locator(".menu-card-add-btn").click();
  }

  /** OptionModal(토핑/맛 선택)이 뜨는 메뉴 — 그룹은 필수 선택, 토핑은 있으면 1개만 추가 */
  async addItemWithOptions(menuName) {
    await expect(this.card(menuName)).toBeVisible({ timeout: 15_000 });
    await this.card(menuName).locator(".menu-card-add-btn").click();

    const modal = this.page.locator(".option-modal");
    const opened = await modal
      .waitFor({ state: "visible", timeout: 5_000 })
      .then(() => true)
      .catch(() => false);

    if (!opened) return; // 옵션/그룹이 전혀 없는 메뉴라면 이미 바로 담긴 것

    await selectFirstAvailableInEachGroup(modal, ".option-modal-group");

    const firstTopping = modal
      .locator(".option-card-toggle-btn:not([disabled])")
      .first();
    if (await firstTopping.count()) {
      await firstTopping.click();
    }

    await modal.locator(".option-modal-submit-button").click();
  }

  /** SetMenuModal(세트 구성 선택)이 뜨는 메뉴 — 그룹마다 선택 가능한 첫 번째 항목 선택 */
  async addSetMenuItem(menuName) {
    await expect(this.card(menuName)).toBeVisible({ timeout: 15_000 });
    await this.card(menuName).locator(".menu-card-add-btn").click();

    const modal = this.page.locator(".set-modal");
    await expect(modal).toBeVisible({ timeout: 5_000 });

    await selectFirstAvailableInEachGroup(modal, ".set-modal-group");
    await modal.locator(".set-modal-submit-button").click();
  }

  async expectCartCount(count) {
    await expect(this.page.locator(".menu-cartbar-count")).toHaveText(
      `${count}개`,
    );
  }

  async goToCart() {
    await this.page.locator(".menu-cartbar-confirm").click();
  }
}

module.exports = { MenuPage };

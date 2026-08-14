// @ts-check
const { expect } = require("@playwright/test");

class CartPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  /** @param {string} menuName */
  async expectContains(menuName) {
    await expect(this.page).toHaveURL(/\/cart$/);
    await expect(this.page.locator(".cart-list")).toContainText(menuName);
  }

  async checkout() {
    await this.page.locator(".cart-confirm-button").click();
  }
}

module.exports = { CartPage };

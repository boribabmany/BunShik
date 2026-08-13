// @ts-check
const { expect } = require("@playwright/test");

class CartPage {
  constructor(page) {
    this.page = page;
  }

  async expectContains(menuName) {
    await expect(this.page).toHaveURL(/\/cart$/);
    await expect(this.page.locator(".cart-list")).toContainText(menuName);
  }

  async checkout() {
    await this.page.locator(".cart-confirm-button").click();
  }
}

module.exports = { CartPage };

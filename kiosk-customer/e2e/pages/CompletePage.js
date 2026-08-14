// @ts-check
const { expect } = require("@playwright/test");

class CompletePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async expectOrderCompleted() {
    await expect(this.page).toHaveURL(/\/complete$/);
    await expect(this.page.locator(".complete-order-number")).not.toBeEmpty();
  }
}

module.exports = { CompletePage };

// @ts-check
const base = require("@playwright/test");
const { HomePage } = require("../pages/HomePage");
const { MenuPage } = require("../pages/MenuPage");
const { CartPage } = require("../pages/CartPage");
const { PaymentPage } = require("../pages/PaymentPage");
const { CompletePage } = require("../pages/CompletePage");

// Playwright의 Page Object Model 픽스처 패턴:
// 각 테스트에서 page.locator(...)를 직접 안 쓰고, 미리 준비된 페이지 객체를 주입받아 쓴다.
const test = base.test.extend({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  menuPage: async ({ page }, use) => {
    await use(new MenuPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
  completePage: async ({ page }, use) => {
    await use(new CompletePage(page));
  },
});

module.exports = { test, expect: base.expect };

// @ts-check

class HomePage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/");
  }

  async selectDineIn() {
    await this.page.getByRole("button", { name: /매장.*식사/s }).click();
  }

  async selectTakeout() {
    await this.page.getByRole("button", { name: /포장.*하기/s }).click();
  }
}

module.exports = { HomePage };

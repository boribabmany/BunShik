// @ts-check
const { expect } = require("@playwright/test");

class PaymentPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * 결제 수단 선택 → 카드결제.
   * 백엔드(PaymentService.simulatePayment)가 확률로 성공/실패를 시뮬레이션하므로
   * (성공 90% / 승인거절 6% / 카드오류 2% / 지연 2%), 재시도 가능한 실패는
   * 최대 maxAttempts까지 재시도 버튼을 눌러 flaky해지지 않게 한다.
   */
  async payWithCard(maxAttempts = 3) {
    await expect(this.page).toHaveURL(/\/payment$/);
    await this.page.locator(".payment-pay-button").click();
    await this.page.locator(".payment-method-card").click();

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const completed = this.page.locator(".complete-order-number");
      const retryBtn = this.page.locator(".fail-card-btn-filled");

      const result = await Promise.race([
        completed
          .waitFor({ state: "visible", timeout: 12_000 })
          .then(() => "done"),
        retryBtn
          .waitFor({ state: "visible", timeout: 12_000 })
          .then(() => "retry"),
      ]).catch(() => "timeout");

      if (result === "done") return;
      if (result === "retry") {
        await retryBtn.click();
        continue;
      }
      throw new Error(
        "결제 결과(성공/재시도 버튼)를 확인하지 못했습니다 — 백엔드/DB 연결을 확인하세요.",
      );
    }

    throw new Error(`결제가 ${maxAttempts}번 시도 후에도 완료되지 않았습니다.`);
  }
}

module.exports = { PaymentPage };

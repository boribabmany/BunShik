// @ts-check
const { expect } = require("@playwright/test");

/**
 * 결제 화면에서 "결제 수단 선택" → 특정 수단 클릭 후,
 * 실패 카드가 뜨면 재시도 버튼을 눌러 최대 maxAttempts까지 반복한다.
 * (카드결제는 백엔드에서 확률로 성공/실패를 시뮬레이션하므로 - PaymentService.simulatePayment)
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ methodSelector?: string, maxAttempts?: number }} [opts]
 */
async function payAndWaitForCompletion(page, opts = {}) {
  const { methodSelector = ".payment-method-card", maxAttempts = 3 } = opts;

  await page.locator(".payment-pay-button").click();
  await page.locator(methodSelector).click();

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const completed = page.locator(".complete-order-number");
    const retryBtn = page.locator(".fail-card-btn-filled");

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

/**
 * OptionModal / SetMenuModal 공통 — 각 선택 그룹(.option-modal-group / .set-modal-group)에서
 * 비활성화(품절)되지 않은 첫 번째 버튼을 하나씩 선택한다.
 * 그룹이 없는 메뉴(순수 토핑만 있거나 아무 선택도 필요 없는 메뉴)라면 아무 것도 하지 않는다.
 *
 * @param {import('@playwright/test').Locator} modal
 * @param {string} groupSelector
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

module.exports = { payAndWaitForCompletion, selectFirstAvailableInEachGroup };

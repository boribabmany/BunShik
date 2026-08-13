/**
 * 적용 화면: 주문 관리·매출 대시보드 (/adminorder, /adminsales)
 * 테스트 내용: UTC 시각을 기준으로 한국 날짜 문자열을 정확히 생성하는지 검증한다.
 */
import { getKoreaDateString } from "../utils/date";

describe("한국 날짜 변환", () => {
  test("UTC 날짜가 달라도 한국 날짜를 YYYY-MM-DD로 반환한다", () => {
    const earlyMorningInKorea =
      new Date("2026-07-29T16:30:00.000Z");

    expect(getKoreaDateString(earlyMorningInKorea))
      .toBe("2026-07-30");
  });
});

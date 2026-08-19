/**
 * 적용 화면: 주문 관리·매출 대시보드 (/adminorder, /adminsales)
 * 테스트 내용: UTC 시각을 기준으로 한국 날짜 문자열을 정확히 생성하는지 검증한다.
 */
import {
  getKoreaDateString,
  getKoreaMonthString,
  getKoreaWeekString,
  isDateInPeriod,
} from "../utils/date";

describe("한국 날짜 변환", () => {
  test("UTC 날짜가 달라도 한국 날짜를 YYYY-MM-DD로 반환한다", () => {
    const earlyMorningInKorea =
      new Date("2026-07-29T16:30:00.000Z");

    expect(getKoreaDateString(earlyMorningInKorea))
      .toBe("2026-07-30");
  });
});

describe("주문 조회 기간", () => {
  test("일·주·월 단위 값을 한국 날짜 기준으로 만든다", () => {
    const date = new Date("2026-08-19T03:00:00Z");

    expect(getKoreaDateString(date)).toBe("2026-08-19");
    expect(getKoreaWeekString(date)).toBe("2026-W34");
    expect(getKoreaMonthString(date)).toBe("2026-08");
  });

  test("주문 시각이 선택한 일·주·월에 포함되는지 판별한다", () => {
    expect(isDateInPeriod("2026-08-19 12:30", "day", "2026-08-19")).toBe(true);
    expect(isDateInPeriod("2026-08-17 09:00", "week", "2026-W34")).toBe(true);
    expect(isDateInPeriod("2026-08-23 22:00", "week", "2026-W34")).toBe(true);
    expect(isDateInPeriod("2026-08-24 00:00", "week", "2026-W34")).toBe(false);
    expect(isDateInPeriod("2026-08-01 00:00", "month", "2026-08")).toBe(true);
    expect(isDateInPeriod("2026-09-01 00:00", "month", "2026-08")).toBe(false);
  });
});

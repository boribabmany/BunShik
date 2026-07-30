import { getKoreaDateString } from "../utils/date";

describe("한국 날짜 변환", () => {
  test("UTC 날짜가 달라도 한국 날짜를 YYYY-MM-DD로 반환한다", () => {
    const earlyMorningInKorea =
      new Date("2026-07-29T16:30:00.000Z");

    expect(getKoreaDateString(earlyMorningInKorea))
      .toBe("2026-07-30");
  });
});

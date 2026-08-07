import useLanguageStore from "./useLanguageStore";

describe("useLanguageStore", () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: "ko" });
  });

  test("기본 언어는 'ko'이다", () => {
    expect(useLanguageStore.getState().language).toBe("ko");
  });

  test("setLanguage: 언어를 'en'으로 변경한다", () => {
    useLanguageStore.getState().setLanguage("en");
    expect(useLanguageStore.getState().language).toBe("en");
  });
});

import { validateMenu, validateOption } from "../utils/validation";

describe("메뉴 검증", () => {
  test("메뉴명이 없으면 실패", () => {
    expect(
      validateMenu({
        menu_name: "",
        category: "김밥",
        price: 2000,
        image_url: "test.jpg",
      })
    ).toBe("메뉴명을 입력하세요.");
  });

  test("가격이 1000원 미만이면 실패", () => {
    expect(
      validateMenu({
        menu_name: "김밥",
        category: "김밥",
        price: 500,
        image_url: "test.jpg",
      })
    ).toBe("가격은 1000원 이상이어야 합니다.");
  });

  test("정상 메뉴는 통과", () => {
    expect(
      validateMenu({
        menu_name: "김밥",
        category: "김밥",
        price: 3000,
        image_url: "test.jpg",
      })
    ).toBe(null);
  });
});

describe("옵션 검증", () => {
  test("옵션명이 없으면 실패", () => {
    expect(
      validateOption({
        option_name: "",
        option_price: 1000,
        option_image: "test.jpg",
      })
    ).toBe("옵션메뉴명을 입력하세요.");
  });

  test("가격이 1000원 미만이면 실패", () => {
    expect(
      validateOption({
        option_name: "치즈 추가",
        option_price: 500,
        option_image: "test.jpg",
      })
    ).toBe("옵션가격은 1000원 이상이어야 합니다.");
  });

  test("정상 옵션은 통과", () => {
    expect(
      validateOption({
        option_name: "치즈 추가",
        option_price: 1000,
        option_image: "test.jpg",
      })
    ).toBe(null);
  });
});
import { validateMenu, validateOption } from "../utils/validation";

describe("메뉴 검증", () => {
  test("메뉴명이 없으면 실패", () => {
    expect(
      validateMenu({
        menu_name: "",
        menu_name_en: "Kimbap",
        category: "김밥",
        price: 2000,
        image_url: "test.jpg",
      }),
    ).toBe("메뉴명을 입력하세요.");
  });

  test("메뉴 영문명이 없으면 실패", () => {
    expect(
      validateMenu({
        menu_name: "김밥",
        menu_name_en: "",
        category: "김밥",
        price: 2000,
        image_url: "test.jpg",
      }),
    ).toBe("메뉴 영문명을 입력하세요.");
  });

  test("가격이 1000원 미만이면 실패", () => {
    expect(
      validateMenu({
        menu_name: "김밥",
        menu_name_en: "Kimbap",
        category: "김밥",
        price: 500,
        image_url: "test.jpg",
      }),
    ).toBe("가격은 1000원 이상이어야 합니다.");
  });

  test("정상 메뉴는 통과", () => {
    expect(
      validateMenu({
        menu_name: "김밥",
        menu_name_en: "Kimbap",
        category: "김밥",
        price: 3000,
        image_url: "test.jpg",
      }),
    ).toBe(null);
  });

  test("기존 이미지가 없어도 새 사진 파일이 있으면 통과", () => {
    const imageFile = new File(["image"], "menu.jpg", {
      type: "image/jpeg",
    });

    expect(
      validateMenu(
        {
          menu_name: "김밥",
          menu_name_en: "Kimbap",
          category: "김밥",
          price: 3000,
          image_url: "",
        },
        imageFile,
      ),
    ).toBe(null);
  });

  test("기존 이미지와 새 사진 파일이 모두 없으면 실패", () => {
    expect(
      validateMenu({
        menu_name: "김밥",
        menu_name_en: "Kimbap",
        category: "김밥",
        price: 3000,
        image_url: "",
      }),
    ).toBe("메뉴 사진을 등록하세요.");
  });

  test("구성 전용 메뉴는 영문명·가격·사진 검증을 생략한다", () => {
    expect(
      validateMenu({
        menu_name: "순한맛",
        menu_name_en: "",
        menu_type: "COMPONENT",
        category: "떡볶이맛",
        price: 0,
        image_url: "",
      }),
    ).toBe(null);
  });
});

describe("옵션 검증", () => {
  test("옵션명이 없으면 실패", () => {
    expect(
      validateOption({
        option_name: "",
        option_name_en: "Cheese",
        option_price: 1000,
        option_image: "test.jpg",
      }),
    ).toBe("옵션메뉴명을 입력하세요.");
  });

  test("옵션 영문명이 없으면 실패", () => {
    expect(
      validateOption({
        option_name: "치즈 추가",
        option_name_en: "",
        option_price: 1000,
        option_image: "test.jpg",
      }),
    ).toBe("옵션 영문명을 입력하세요.");
  });

  test("가격이 1000원 미만이면 실패", () => {
    expect(
      validateOption({
        option_name: "치즈 추가",
        option_name_en: "Extra cheese",
        option_price: 500,
        option_image: "test.jpg",
      }),
    ).toBe("옵션가격은 1000원 이상이어야 합니다.");
  });

  test("정상 옵션은 통과", () => {
    expect(
      validateOption({
        option_name: "치즈 추가",
        option_name_en: "Extra cheese",
        option_price: 1000,
        option_image: "test.jpg",
      }),
    ).toBe(null);
  });

  test("기존 이미지가 없어도 새 사진 파일이 있으면 통과", () => {
    const imageFile = new File(["image"], "option.jpg", {
      type: "image/jpeg",
    });

    expect(
      validateOption(
        {
          option_name: "치즈 추가",
          option_name_en: "Extra cheese",
          option_price: 1000,
          option_image: "",
        },
        imageFile,
      ),
    ).toBe(null);
  });

  test("기존 이미지와 새 사진 파일이 모두 없으면 실패", () => {
    expect(
      validateOption({
        option_name: "치즈 추가",
        option_name_en: "Extra cheese",
        option_price: 1000,
        option_image: "",
      }),
    ).toBe("옵션 사진을 등록하세요.");
  });

});

import { createMenuFormData } from "../utils/menuFormData";

describe("createMenuFormData", () => {
  test("세트 메뉴와 구성 설정을 multipart 필드로 변환한다", () => {
    const formData = createMenuFormData(
      {
        menu_name: "김밥 세트",
        menu_name_en: "Kimbap set",
        price: 6500,
        category: "세트",
        description: "세트 설명",
        description_en: "Set description",
        base_is_available: true,
        is_available: false,
      },
      null,
      [1, 2],
      {
        1: { select_group: "김밥선택", group_max_select: 1, extra_price: 0 },
        2: { select_group: "김밥선택", group_max_select: 1, extra_price: 1500 },
      },
    );

    expect(formData.get("menuName")).toBe("김밥 세트");
    expect(formData.get("isAvailable")).toBe("true");
    expect(formData.getAll("componentMenuIds")).toEqual(["1", "2"]);
    expect(formData.get("componentSettings[1].selectGroup"))
      .toBe("김밥선택");
    expect(formData.get("componentSettings[1].extraPrice")).toBe("1500");
  });
});

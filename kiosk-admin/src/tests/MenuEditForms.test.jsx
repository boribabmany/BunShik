/**
 * 적용 화면: 관리자 메뉴 편집 페이지 (/adminmenuedit)
 * 테스트 내용: 메뉴·옵션 편집 폼과 세트 구성 전용 입력 항목의 표시·변경을 검증한다.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import MenuEditorForm from "../components/admin/menu-edit/MenuEditorForm";
import OptionEditorForm from "../components/admin/menu-edit/OptionEditorForm";

describe("관리자 메뉴 편집 폼", () => {
  test("세트 메뉴의 일반 구성 후보와 선택 설정을 표시한다", () => {
    const onChange = jest.fn();
    const onComponentToggle = jest.fn();
    const onComponentSettingChange = jest.fn();

    render(
      <MenuEditorForm
        item={{
          menu_name: "떡순튀세트",
          menu_name_en: "Bunshik Set",
          category: "세트",
          price: 11000,
          base_is_available: true,
        }}
        menus={[
          { menu_id: 1, menu_name: "떡볶이", category: "떡볶이" },
          { menu_id: 3, menu_name: "순한맛", category: "떡볶이맛" },
          { menu_id: 2, menu_name: "다른 세트", category: "세트" },
        ]}
        isComponentsLoading={false}
        selectedComponentIds={[1, 3]}
        componentSettings={{
          1: {
            select_group: "떡볶이선택",
            group_max_select: 1,
            extra_price: 0,
          },
          3: {
            select_group: "떡볶이선택",
            group_max_select: 1,
            extra_price: 0,
          },
        }}
        onChange={onChange}
        onImageChange={jest.fn()}
        onComponentToggle={onComponentToggle}
        onComponentSettingChange={onComponentSettingChange}
      />,
    );

    expect(screen.getByDisplayValue("떡순튀세트")).toBeTruthy();
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    expect(screen.queryByText("다른 세트")).toBeNull();

    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    expect(onComponentToggle).toHaveBeenCalledWith(1);

    fireEvent.change(screen.getAllByDisplayValue("떡볶이선택")[0], {
      target: { value: "맛선택" },
    });
    expect(onComponentSettingChange).toHaveBeenCalledWith(
      1,
      "select_group",
      "맛선택",
    );

    const maxSelect = screen.getAllByText("최대 선택 수")[0]
      .closest("label")
      .querySelector("select");
    expect(Array.from(maxSelect.options).map((option) => option.textContent))
      .toEqual(["1개"]);
    expect(maxSelect.disabled).toBe(true);
  });

  test("옵션 입력 변경을 상위 편집 화면으로 전달한다", () => {
    const onChange = jest.fn();

    render(
      <OptionEditorForm
        item={{
          option_name: "치즈",
          option_name_en: "Cheese",
          option_price: 1000,
          option_is_available: true,
        }}
        onChange={onChange}
        onImageChange={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByDisplayValue("치즈"), {
      target: { value: "모짜렐라 치즈" },
    });

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0].target.name).toBe("option_name");
    expect(screen.getByDisplayValue("1,000")).toBeTruthy();

    fireEvent.change(screen.getByDisplayValue("1,000"), {
      target: { name: "option_price", value: "12,300" },
    });
    expect(onChange.mock.calls[1][0].target).toEqual({
      name: "option_price",
      value: "12300",
    });
  });

  test("구성 전용 메뉴는 설명·가격·사진 입력을 표시하지 않는다", () => {
    render(
      <MenuEditorForm
        item={{
          menu_name: "순한맛",
          menu_name_en: "Mild",
          menu_type: "COMPONENT",
          category: "떡볶이맛",
          price: 0,
          base_is_available: true,
        }}
        menus={[]}
        isComponentsLoading={false}
        selectedComponentIds={[]}
        componentSettings={{}}
        onChange={jest.fn()}
        onImageChange={jest.fn()}
        onComponentToggle={jest.fn()}
        onComponentSettingChange={jest.fn()}
      />,
    );

    expect(screen.getByDisplayValue("세트 구성 전용")).toBeTruthy();
    expect(screen.queryByText("설명")).toBeNull();
    expect(screen.queryByText("영문 설명")).toBeNull();
    expect(screen.queryByText("가격")).toBeNull();
    expect(screen.queryByText("사진")).toBeNull();
  });
});

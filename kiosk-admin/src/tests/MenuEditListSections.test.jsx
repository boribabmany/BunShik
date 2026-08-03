import { fireEvent, render, screen } from "@testing-library/react";
import MenuListSection from "../components/admin/menu-edit/MenuListSection";
import OptionListSection from "../components/admin/menu-edit/OptionListSection";

describe("메뉴관리 목록 섹션", () => {
  test("메뉴 목록 검색과 등록·수정 콜백을 연결한다", () => {
    const onAddMenu = jest.fn();
    const onAddComponentMenu = jest.fn();
    const onEdit = jest.fn();
    const menus = [
      {
        menu_id: 1,
        menu_name: "참치김밥",
        menu_name_en: "Tuna Kimbap",
        category: "김밥",
        price: 4500,
        is_visible: true,
        is_available: true,
      },
      {
        menu_id: 2,
        menu_name: "라면",
        menu_name_en: "Ramen",
        category: "라면",
        price: 5000,
        is_visible: true,
        is_available: false,
      },
      {
        menu_id: 3,
        menu_name: "순한맛",
        menu_name_en: "Mild",
        menu_type: "COMPONENT",
        category: "떡볶이맛",
        price: 0,
        is_visible: true,
        is_available: true,
      },
    ];

    render(
      <MenuListSection
        menus={menus}
        onAddMenu={onAddMenu}
        onAddSetMenu={jest.fn()}
        onAddComponentMenu={onAddComponentMenu}
        onEdit={onEdit}
        onToggleVisibility={jest.fn()}
        onImageClick={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("메뉴관리 메뉴 검색"), {
      target: { value: "Ramen" },
    });
    expect(screen.getByText("Ramen")).toBeTruthy();
    expect(screen.queryByText("Tuna Kimbap")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "+ 메뉴 등록" }));
    fireEvent.click(screen.getByRole("button", { name: "수정" }));
    expect(onAddMenu).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith("menu", menus[1]);

    fireEvent.change(screen.getByLabelText("메뉴관리 메뉴 검색"), {
      target: { value: "" },
    });
    expect(screen.getByText("구성 전용 메뉴")).toBeTruthy();
    expect(screen.getByText("Mild")).toBeTruthy();
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(["세트 메뉴", "구성 전용 메뉴", "일반 메뉴"]);
    fireEvent.click(screen.getByRole("button", { name: "+ 구성품 등록" }));
    expect(onAddComponentMenu).toHaveBeenCalledTimes(1);
  });

  test("옵션 목록 검색과 등록·판매상태 콜백을 연결한다", () => {
    const onAdd = jest.fn();
    const onToggleVisibility = jest.fn();
    const option = {
      option_id: 10,
      option_name: "치즈 추가",
      option_name_en: "Extra cheese",
      option_price: 1000,
      is_visible: true,
      option_is_available: true,
    };

    render(
      <OptionListSection
        options={[option]}
        onAdd={onAdd}
        onEdit={jest.fn()}
        onToggleVisibility={onToggleVisibility}
        onImageClick={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("메뉴관리 옵션 검색"), {
      target: { value: "cheese" },
    });
    fireEvent.click(screen.getByRole("button", { name: "+ 옵션 등록" }));
    fireEvent.click(screen.getByRole("button", { name: "판매중단" }));
    expect(screen.getByText("치즈 추가")).toBeTruthy();
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onToggleVisibility).toHaveBeenCalledWith(option);
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SetMenuModal from "./SetMenuModal";

// 옵션 카드가 3개 이상이라 DragScrollRow 슬라이드가 적용되는 케이스
const menu = {
  menu_id: 10,
  menu_name: "떡볶이",
  menu_name_en: "Tteokbokki",
  description: "매콤한 떡볶이",
  description_en: "Spicy tteokbokki",
  image_url: "/tteokbokki.png",
  price: 4000,
  set_components: [
    {
      component_menu_id: 1,
      select_group: "떡볶이선택",
      group_max_select: 1,
      component_menu_name: "순한맛",
      component_menu_name_en: "Mild",
      extra_price: 0,
      is_available: true,
    },
    {
      component_menu_id: 2,
      select_group: "떡볶이선택",
      group_max_select: 1,
      component_menu_name: "중간맛",
      component_menu_name_en: "Medium",
      extra_price: 0,
      is_available: true,
    },
    {
      component_menu_id: 3,
      select_group: "떡볶이선택",
      group_max_select: 1,
      component_menu_name: "매운맛",
      component_menu_name_en: "Hot",
      extra_price: 0,
      is_available: true,
    },
  ],
};

describe("SetMenuModal", () => {
  test("옵션 그룹과 옵션 카드 3개를 모두 렌더링한다", () => {
    render(
      <SetMenuModal menu={menu} onClose={() => {}} onAdd={() => {}} language="ko" />,
    );

    expect(screen.getByText("순한맛")).toBeInTheDocument();
    expect(screen.getByText("중간맛")).toBeInTheDocument();
    expect(screen.getByText("매운맛")).toBeInTheDocument();
  });

  test("옵션을 선택하지 않으면 담기 버튼이 비활성화된다", () => {
    render(
      <SetMenuModal menu={menu} onClose={() => {}} onAdd={() => {}} language="ko" />,
    );

    const submitButton = screen.getByRole("button", { name: /메뉴 담기/ });
    expect(submitButton).toBeDisabled();
  });

  test("옵션 카드를 클릭(드래그 없이)하면 선택되고 담기 버튼이 활성화된다", async () => {
    render(
      <SetMenuModal menu={menu} onClose={() => {}} onAdd={() => {}} language="ko" />,
    );

    const spicyOption = screen.getByText("매운맛");
    await userEvent.click(spicyOption);

    expect(spicyOption).toHaveClass("is-selected");
    expect(screen.getByRole("button", { name: /메뉴 담기/ })).toBeEnabled();
  });

  test("같은 옵션을 다시 클릭하면 선택이 해제된다", async () => {
    render(
      <SetMenuModal menu={menu} onClose={() => {}} onAdd={() => {}} language="ko" />,
    );

    const spicyOption = screen.getByText("매운맛");
    await userEvent.click(spicyOption);
    expect(spicyOption).toHaveClass("is-selected");

    await userEvent.click(spicyOption);
    expect(spicyOption).not.toHaveClass("is-selected");
  });

  test("옵션 선택 후 담기를 누르면 선택한 구성으로 onAdd가 호출되고 모달이 닫힌다", async () => {
    const handleAdd = jest.fn();
    const handleClose = jest.fn();
    render(
      <SetMenuModal
        menu={menu}
        onClose={handleClose}
        onAdd={handleAdd}
        language="ko"
      />,
    );

    await userEvent.click(screen.getByText("매운맛"));
    await userEvent.click(screen.getByRole("button", { name: /메뉴 담기/ }));

    expect(handleAdd).toHaveBeenCalledTimes(1);
    expect(handleAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        menu_id: 10,
        base_price: 4000,
        components: [expect.objectContaining({ component_menu_id: 3 })],
      }),
    );
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

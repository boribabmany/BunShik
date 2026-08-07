import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Menu from "./Menu";
import useCartStore from "../../store/useCartStore";
import useLanguageStore from "../../store/useLanguageStore";
import { getMenus } from "../../api/menuApi";

jest.mock("../../api/menuApi");

const menus = [
  {
    menu_id: 1,
    menu_name: "떡볶이",
    menu_name_en: "Tteokbokki",
    image_url: "/tteokbokki.png",
    price: 4000,
    is_available: true,
    category: "떡볶이",
    options: [],
    set_components: [],
  },
  {
    menu_id: 2,
    menu_name: "김밥",
    menu_name_en: "Kimbap",
    image_url: "/kimbap.png",
    price: 3000,
    is_available: true,
    category: "김밥",
    options: [],
    set_components: [],
  },
];

function renderMenu() {
  return render(
    <MemoryRouter initialEntries={["/menu"]}>
      <Menu />
    </MemoryRouter>,
  );
}

describe("Menu", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    useLanguageStore.setState({ language: "ko" });
    getMenus.mockReset();
  });

  test("로딩 후 메뉴 카드 목록을 표시한다", async () => {
    getMenus.mockResolvedValueOnce(menus);
    renderMenu();

    expect(screen.getByText("메뉴를 불러오는 중입니다...")).toBeInTheDocument();

    expect(await screen.findByText("떡볶이")).toBeInTheDocument();
    expect(screen.getByText("김밥")).toBeInTheDocument();
  });

  test("카테고리 탭을 선택하면 해당 카테고리 메뉴만 표시한다", async () => {
    getMenus.mockResolvedValueOnce(menus);
    const { container } = renderMenu();

    await screen.findByText("떡볶이");

    await userEvent.click(screen.getByRole("button", { name: "김밥" }));

    const cardNames = Array.from(
      container.querySelectorAll(".menu-card-name"),
    ).map((el) => el.textContent);
    expect(cardNames).toEqual(["김밥"]);
  });

  test("옵션/세트구성이 없는 메뉴는 클릭하면 바로 장바구니에 담긴다", async () => {
    getMenus.mockResolvedValueOnce(menus);
    const { container } = renderMenu();

    await screen.findByText("떡볶이");

    const addButtons = container.querySelectorAll(".menu-card-add-btn");
    await userEvent.click(addButtons[0]);

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].menu_id).toBe(1);
    expect(screen.getByText("1개")).toBeInTheDocument(); // CartBar count
  });

  test("메뉴 조회 실패 시 에러 문구와 재시도 버튼을 표시한다", async () => {
    getMenus.mockRejectedValueOnce(new Error("network error"));
    renderMenu();

    expect(
      await screen.findByText("메뉴를 불러오지 못했습니다. 잠시 후 다시 시도해주세요."),
    ).toBeInTheDocument();

    getMenus.mockResolvedValueOnce(menus);
    await userEvent.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(await screen.findByText("떡볶이")).toBeInTheDocument();
  });
});

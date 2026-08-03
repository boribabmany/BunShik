import { fireEvent, render, screen } from "@testing-library/react";
import AdminMenusTable from "../components/admin/AdminMenusTable";
import AdminOptionsTable from "../components/admin/AdminOptionsTable";
import useMenuStore from "../store/menuStore";
import useOptionStore from "../store/optionStore";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));
jest.mock("../store/menuStore");
jest.mock("../store/optionStore");

describe("관리자 메뉴·옵션 검색 필터", () => {
  beforeEach(() => {
    useMenuStore.mockImplementation((selector) =>
      selector({
        menuList: [
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
            menu_id: 21,
            menu_name: "순한맛",
            menu_name_en: "Mild",
            menu_type: "COMPONENT",
            category: "떡볶이맛",
            price: 0,
            is_visible: true,
            is_available: true,
          },
        ],
      }),
    );
    useOptionStore.mockImplementation((selector) =>
      selector({
        optionList: [
          {
            option_id: 10,
            option_name: "치즈 추가",
            option_name_en: "Extra cheese",
            option_price: 1000,
            is_visible: true,
            option_is_available: true,
          },
          {
            option_id: 11,
            option_name: "계란 추가",
            option_name_en: "Extra egg",
            option_price: 1000,
            is_visible: false,
            option_is_available: true,
          },
        ],
      }),
    );
  });

  test("대시보드 메뉴를 검색하고 판매상태로 필터링한다", () => {
    render(<AdminMenusTable />);

    expect(screen.queryByText("순한맛")).toBeNull();
    expect(screen.queryByRole("option", { name: "떡볶이맛" })).toBeNull();
    expect(screen.getByText("2/2개")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("메뉴 검색"), {
      target: { value: "Ramen" },
    });
    expect(screen.getByRole("cell", { name: "2" })).toBeTruthy();
    expect(screen.queryByRole("cell", { name: "1" })).toBeNull();

    fireEvent.change(screen.getByLabelText("메뉴 검색"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("메뉴 판매상태 필터"), {
      target: { value: "soldout" },
    });
    expect(screen.getByRole("cell", { name: "2" })).toBeTruthy();
    expect(screen.queryByRole("cell", { name: "1" })).toBeNull();
  });

  test("대시보드 옵션을 검색하고 판매상태로 필터링한다", () => {
    render(<AdminOptionsTable />);

    fireEvent.change(screen.getByLabelText("옵션 검색"), {
      target: { value: "cheese" },
    });
    expect(screen.getByText("치즈 추가")).toBeTruthy();
    expect(screen.queryByText("계란 추가")).toBeNull();

    fireEvent.change(screen.getByLabelText("옵션 검색"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("옵션 판매상태 필터"), {
      target: { value: "stopped" },
    });
    expect(screen.getByText("계란 추가")).toBeTruthy();
    expect(screen.queryByText("치즈 추가")).toBeNull();
  });
});

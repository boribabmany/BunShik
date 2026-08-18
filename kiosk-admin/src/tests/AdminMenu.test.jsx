import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminMenu from "../pages/admin/AdminMenu";
import useMenuStore from "../store/menuStore";
import useOptionStore from "../store/optionStore";
import useAdminOrderStore from "../store/adminOrderStore";

jest.mock("react-router-dom", () => ({ useNavigate: () => jest.fn() }));
jest.mock("../store/menuStore");
jest.mock("../store/optionStore");
jest.mock("../store/adminOrderStore");
jest.mock("../components/admin/menu/AdminSummary", () => () => <div>요약</div>);
jest.mock("../components/admin/menu/AdminMenusTable", () => () => <div>메뉴 목록</div>);
jest.mock("../components/admin/menu/AdminOptionsTable", () => () => <div>옵션 목록</div>);
jest.mock("../components/admin/shared/ImagePreviewModal", () => () => null);

describe("관리자 메인 데이터 조회 오류", () => {
  const loadMenus = jest.fn();
  const loadOptions = jest.fn();
  const loadOrders = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    loadMenus.mockRejectedValueOnce(new Error("menu error")).mockResolvedValue(undefined);
    loadOptions.mockResolvedValue(undefined);
    loadOrders.mockResolvedValue(undefined);
    useMenuStore.mockImplementation((selector) => selector({ loadMenus }));
    useOptionStore.mockImplementation((selector) => selector({ loadOptions }));
    useAdminOrderStore.mockImplementation((selector) => selector({ loadOrders }));
  });

  test("실패한 데이터만 안내하고 다시 조회한다", async () => {
    render(<AdminMenu />);

    const retryButton = await screen.findByRole("button", { name: "메뉴 다시 시도" });
    expect(screen.queryByRole("button", { name: "옵션 다시 시도" })).toBeNull();
    fireEvent.click(retryButton);

    await waitFor(() => expect(loadMenus).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });
});

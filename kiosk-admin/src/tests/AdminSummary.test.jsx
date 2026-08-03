import { render, screen, waitFor } from "@testing-library/react";
import AdminSummary from "../components/admin/AdminSummary";
import useMenuStore from "../store/menuStore";
import useOptionStore from "../store/optionStore";
import useSalesStore from "../store/salesStore";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));
jest.mock("../store/menuStore");
jest.mock("../store/optionStore");
jest.mock("../store/salesStore");
jest.mock("../components/admin/UpdateHistory", () => () => null);

describe("AdminSummary", () => {
  test("매출 대시보드와 동일한 완료 주문 요약을 표시한다", async () => {
    const loadSalesSummary = jest.fn().mockResolvedValue(undefined);

    useMenuStore.mockImplementation((selector) =>
      selector({ menuList: [{ menu_id: 1 }, { menu_id: 2 }] }),
    );
    useOptionStore.mockImplementation((selector) =>
      selector({ optionList: [{ option_id: 1 }] }),
    );
    useSalesStore.mockImplementation((selector) =>
      selector({
        salesSummary: {
          todayOrders: 5,
          todaySales: 54500,
        },
        loadSalesSummary,
      }),
    );

    render(<AdminSummary onMoveOrder={jest.fn()} />);

    expect(screen.getByText("2개")).toBeTruthy();
    expect(screen.getByText("1개")).toBeTruthy();
    expect(screen.getByText("5건")).toBeTruthy();
    expect(screen.getByText("54,500원")).toBeTruthy();
    await waitFor(() => expect(loadSalesSummary).toHaveBeenCalledTimes(1));
  });
});

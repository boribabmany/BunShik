import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminOrder from "../pages/admin/AdminOrder";
import useAdminOrderStore from "../store/adminOrderStore";
import { getOrderDetail } from "../api/adminOrderApi";
import { getKoreaDateString } from "../utils/date";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));
jest.mock("../store/adminOrderStore");
jest.mock("../api/adminOrderApi", () => ({
  getOrderDetail: jest.fn(),
}));

const today = getKoreaDateString();

const order = {
  order_id: 1,
  order_number: "A-001",
  created_at: `${today} 12:30`,
  order_type: "매장",
  order_status: "접수",
  total_price: 6500,
};

const detail = {
  ...order,
  items: [
    {
      order_item_id: 10,
      menu_name: "참치김밥",
      quantity: 1,
      unit_price: 4500,
      options: [
        {
          option_id: 101,
          option_name: "치즈 추가",
          option_price: 1000,
        },
      ],
      components: [
        {
          component_menu_id: 201,
          component_menu_name: "떡볶이",
        },
        {
          component_menu_id: 202,
          component_menu_name: "순대",
        },
      ],
    },
  ],
};

describe("관리자 주문 관리", () => {
  const loadOrders = jest.fn();
  const changeOrderStatus = jest.fn();
  const cancelOrder = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAdminOrderStore.mockReturnValue({
      orders: [order],
      loadOrders,
      changeOrderStatus,
      cancelOrder,
    });
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderPage = () => render(<AdminOrder />);

  test("주문 행을 누르면 상세 메뉴와 옵션을 펼쳐 표시한다", async () => {
    getOrderDetail.mockResolvedValue(detail);
    renderPage();

    fireEvent.click(screen.getByText("A-001"));

    expect(getOrderDetail).toHaveBeenCalledWith(1);
    expect(await screen.findByText("참치김밥")).toBeTruthy();
    expect(screen.getByText(/치즈 추가/)).toBeTruthy();
    expect(screen.getByText("세트 구성")).toBeTruthy();
    expect(screen.getByText("떡볶이")).toBeTruthy();
    expect(screen.getByText("순대")).toBeTruthy();
    expect(screen.getByText("총 결제금액")).toBeTruthy();
  });

  test("상태 변경 실패 시 백엔드 오류 메시지를 표시한다", async () => {
    changeOrderStatus.mockRejectedValue({
      response: {
        data: {
          message: "허용되지 않는 상태 전이입니다.",
        },
      },
    });
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "조리 시작" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "허용되지 않는 상태 전이입니다.",
      );
    });
  });

  test("주문 취소 실패 시 백엔드 오류 메시지를 표시한다", async () => {
    cancelOrder.mockRejectedValue({
      response: {
        data: {
          message: "완료된 주문은 취소할 수 없습니다.",
        },
      },
    });
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(window.confirm).toHaveBeenCalledWith(
      "주문을 취소하시겠습니까?",
    );
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "완료된 주문은 취소할 수 없습니다.",
      );
    });
  });
});

/**
 * 적용 화면: 로그인 후 모든 관리자 화면 (주문 관리 화면 제외)
 * 테스트 내용: 신규 주문 토스트 표시, 주문 화면 이동 및 알림음 재생을 검증한다.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import NewOrderToast from "../components/admin/shared/NewOrderToast";
import useAdminOrderStore from "../store/adminOrderStore";
import { playNewOrderSound } from "../utils/newOrderSound";

const mockNavigate = jest.fn();
let mockPathname = "/adminmenu";

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname }),
}));
jest.mock("../store/adminOrderStore");
jest.mock("../utils/newOrderSound", () => ({
  playNewOrderSound: jest.fn(),
}));

const existingOrder = {
  order_id: 1,
  order_number: "A-001",
  order_type: "매장",
  order_status: "접수",
  total_price: 6500,
};

describe("관리자 공통 신규 주문 토스트", () => {
  const loadOrders = jest.fn().mockResolvedValue([]);
  let currentOrders;

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    mockPathname = "/adminmenu";
    currentOrders = [existingOrder];
    useAdminOrderStore.mockImplementation((selector) =>
      selector({ orders: currentOrders, loadOrders }),
    );
    playNewOrderSound.mockResolvedValue(undefined);
  });

  test("다른 관리자 화면에서 신규 주문을 작은 토스트로 표시한다", () => {
    const { rerender } = render(<NewOrderToast />);
    currentOrders = [
      { ...existingOrder, order_id: 2, order_number: "A-002" },
      existingOrder,
    ];

    rerender(<NewOrderToast />);

    expect(screen.getByText("신규 주문 A-002")).toBeTruthy();
    expect(screen.getByText("매장 · 6,500원")).toBeTruthy();
  });

  test("토스트를 누르면 주문 관리 화면으로 이동한다", () => {
    const { rerender } = render(<NewOrderToast />);
    currentOrders = [
      { ...existingOrder, order_id: 2, order_number: "A-002" },
      existingOrder,
    ];
    rerender(<NewOrderToast />);

    fireEvent.click(screen.getByText("신규 주문 A-002"));

    expect(mockNavigate).toHaveBeenCalledWith("/adminorder");
  });

  test("알림음 설정이 켜져 있으면 주문 화면 밖에서 소리를 재생한다", () => {
    sessionStorage.setItem("adminOrderSoundEnabled", "true");
    const { rerender } = render(<NewOrderToast />);
    currentOrders = [
      { ...existingOrder, order_id: 2, order_number: "A-002" },
      existingOrder,
    ];

    rerender(<NewOrderToast />);

    expect(playNewOrderSound).toHaveBeenCalledTimes(1);
  });
});

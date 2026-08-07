import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Payment from "./Payment";
import useCartStore from "../../store/useCartStore";
import useOrderStore from "../../store/useOrderStore";
import useLanguageStore from "../../store/useLanguageStore";
import { createOrder, submitPayment, withRetry } from "../../api/orderApi";

jest.mock("../../api/orderApi");
jest.mock("@tosspayments/tosspayments-sdk", () => ({
  ANONYMOUS: "anonymous",
  loadTossPayments: jest.fn(),
}));

const sampleItem = {
  menu_id: 1,
  menu_name: "떡볶이",
  menu_name_en: "Tteokbokki",
  image_url: "/tteokbokki.png",
  base_price: 4000,
  quantity: 1,
  options: [],
  components: [],
};

function renderPayment() {
  return render(
    <MemoryRouter initialEntries={["/payment"]}>
      <Routes>
        <Route path="/payment" element={<Payment />} />
        <Route path="/menu" element={<div>메뉴 화면</div>} />
        <Route path="/complete" element={<div>주문완료 화면</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Payment", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    useOrderStore.setState({
      orderType: "dine-in",
      orderNumber: null,
      totalPrice: 0,
      pendingOrderId: null,
    });
    useLanguageStore.setState({ language: "ko" });
    withRetry.mockImplementation((fn) => fn());
    createOrder.mockReset();
    submitPayment.mockReset();
  });

  test("장바구니가 비어있으면 안내 모달을 표시한다", () => {
    renderPayment();
    expect(screen.getByText("주문목록이 비어있습니다")).toBeInTheDocument();
  });

  test("주문 항목과 총 결제 금액을 표시한다", () => {
    useCartStore.setState({ items: [sampleItem] });
    const { container } = renderPayment();

    expect(screen.getByText("떡볶이")).toBeInTheDocument();
    expect(
      container.querySelector(".payment-total-price"),
    ).toHaveTextContent("4,000원");
  });

  test("카드 결제 성공 시 주문완료 화면으로 이동하고 장바구니가 비워진다", async () => {
    useCartStore.setState({ items: [sampleItem] });
    createOrder.mockResolvedValueOnce({
      status: "대기",
      order_id: 1,
      order_number: "A-1",
    });
    submitPayment.mockResolvedValueOnce({ status: "성공" });

    renderPayment();

    await userEvent.click(screen.getByRole("button", { name: "결제 수단 선택" }));
    await userEvent.click(screen.getByRole("button", { name: "카드 결제" }));

    await waitFor(() => {
      expect(screen.getByText("주문완료 화면")).toBeInTheDocument();
    });

    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useOrderStore.getState().orderNumber).toBe("A-1");
  });

  test("결제가 거절되면 실패 카드가 표시된다", async () => {
    useCartStore.setState({ items: [sampleItem] });
    createOrder.mockResolvedValueOnce({
      status: "대기",
      order_id: 1,
      order_number: "A-1",
    });
    submitPayment.mockResolvedValueOnce({
      status: "실패",
      fail_type: "declined",
      fail_reason: "한도초과",
    });

    renderPayment();

    await userEvent.click(screen.getByRole("button", { name: "결제 수단 선택" }));
    await userEvent.click(screen.getByRole("button", { name: "카드 결제" }));

    expect(await screen.findByText("결제 거절")).toBeInTheDocument();
  });
});

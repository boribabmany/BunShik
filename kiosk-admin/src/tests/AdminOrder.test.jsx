/**
 * 적용 화면: 관리자 주문 관리 페이지 (/adminorder)
 * 테스트 내용: 주문 상세, 상태 변경·취소, 자동 갱신, 신규 주문 알림 및 지연 표시를 검증한다.
 */
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import AdminOrder from "../pages/admin/AdminOrder";
import useAdminOrderStore from "../store/adminOrderStore";
import { getOrderDetail } from "../api/adminOrderApi";
import { getKoreaDateString } from "../utils/date";
import { playNewOrderSound } from "../utils/newOrderSound";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));
jest.mock("../store/adminOrderStore");
jest.mock("../api/adminOrderApi", () => ({
  getOrderDetail: jest.fn(),
}));
jest.mock("../utils/newOrderSound", () => ({
  playNewOrderSound: jest.fn(),
}));

const today = getKoreaDateString();

const order = {
  order_id: 1,
  order_number: "A-001",
  created_at: `${today} 12:30`,
  order_type: "매장",
  payment_method: "카드",
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
  const changeBulkOrderStatus = jest.fn();
  const cancelBulkOrders = jest.fn();
  const cancelOrder = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    loadOrders.mockResolvedValue([order]);
    playNewOrderSound.mockResolvedValue(undefined);
    useAdminOrderStore.mockReturnValue({
      orders: [order],
      loadOrders,
      changeOrderStatus,
      changeBulkOrderStatus,
      cancelBulkOrders,
      cancelOrder,
    });
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  const renderPage = () => render(<AdminOrder />);

  test("주문 상태를 색상 배지로 표시한다", () => {
    renderPage();

    expect(
      screen
        .getByText("접수", { selector: "span" })
        .classList.contains("order-status-received"),
    ).toBe(true);
  });

  test("현재 조회 주문의 접수와 조리중 건수를 표시한다", () => {
    const cookingOrder = {
      ...order,
      order_id: 2,
      order_number: "A-002",
      order_status: "조리중",
    };
    useAdminOrderStore.mockReturnValue({
      orders: [order, cookingOrder],
      loadOrders,
      changeOrderStatus,
      changeBulkOrderStatus,
      cancelBulkOrders,
      cancelOrder,
    });

    renderPage();

    expect(screen.getByText("접수 1건")).toBeTruthy();
    expect(screen.getByText("조리중 1건")).toBeTruthy();
  });

  test("취소 주문을 취소 필터에서 이력으로 조회한다", () => {
    const canceledOrder = {
      ...order,
      order_id: 2,
      order_number: "A-002",
      order_status: "취소",
    };
    useAdminOrderStore.mockReturnValue({
      orders: [order, canceledOrder],
      loadOrders,
      changeOrderStatus,
      changeBulkOrderStatus,
      cancelBulkOrders,
      cancelOrder,
    });

    renderPage();
    fireEvent.change(screen.getAllByRole("combobox")[1], {
      target: { value: "취소" },
    });

    expect(screen.getByText("A-002")).toBeTruthy();
    expect(screen.queryByText("A-001")).toBeNull();
    expect(
      screen
        .getByText("취소", { selector: "span" })
        .classList.contains("order-status-cancelled"),
    ).toBe(true);
  });

  test("상태 변경 성공 결과를 화면에 표시한다", async () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "조리 시작" }));

    expect(
      await screen.findByText("A-001 상태가 조리중(으)로 변경되었습니다."),
    ).toBeTruthy();
  });

  test("주문 행을 누르면 상세 메뉴와 옵션을 펼쳐 표시한다", async () => {
    getOrderDetail.mockResolvedValue(detail);
    renderPage();

    expect(screen.getByText("결제방법")).toBeTruthy();
    expect(screen.getByText("카드")).toBeTruthy();

    fireEvent.click(screen.getByText("A-001"));

    expect(getOrderDetail).toHaveBeenCalledWith(1);
    expect(await screen.findByText("참치김밥")).toBeTruthy();
    expect(screen.getByText("주문번호 A-001")).toBeTruthy();
    expect(screen.getByText("메뉴")).toBeTruthy();
    expect(screen.getByText("수량")).toBeTruthy();
    expect(screen.getByText("금액")).toBeTruthy();
    expect(screen.getByText(/치즈 추가/)).toBeTruthy();
    expect(screen.getByText("옵션")).toBeTruthy();
    expect(screen.getByText("세트 구성")).toBeTruthy();
    expect(screen.getByText("떡볶이")).toBeTruthy();
    expect(screen.getByText("순대")).toBeTruthy();
    expect(screen.getByText("총 결제금액")).toBeTruthy();
    expect(screen.getByText("결제 카드")).toBeTruthy();
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

    expect(
      await screen.findByText("허용되지 않는 상태 전이입니다."),
    ).toBeTruthy();
  });

  test("주문 상태 변경 처리 중에는 연속 요청을 막는다", async () => {
    let resolveStatusChange;
    changeOrderStatus.mockImplementation(
      () => new Promise((resolve) => {
        resolveStatusChange = resolve;
      }),
    );
    renderPage();

    const statusButton = screen.getByRole("button", { name: "조리 시작" });
    fireEvent.click(statusButton);
    fireEvent.click(statusButton);

    expect(changeOrderStatus).toHaveBeenCalledTimes(1);
    expect(statusButton.disabled).toBe(true);

    resolveStatusChange();
    await waitFor(() => expect(statusButton.disabled).toBe(false));
  });

  test("같은 상태의 주문 여러 건을 선택해 조리를 시작한다", async () => {
    const secondOrder = {
      ...order,
      order_id: 2,
      order_number: "A-002",
    };
    useAdminOrderStore.mockReturnValue({
      orders: [order, secondOrder],
      loadOrders,
      changeOrderStatus,
      changeBulkOrderStatus,
      cancelBulkOrders,
      cancelOrder,
    });
    renderPage();

    fireEvent.change(screen.getAllByRole("combobox")[1], {
      target: { value: "접수" },
    });
    fireEvent.click(screen.getByLabelText("현재 화면 주문 전체 선택"));
    expect(screen.getByText("선택 2건")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: "선택 주문 조리 시작" }),
    );

    expect(window.confirm).toHaveBeenCalledWith(
      "선택한 주문 2건을 조리 시작 처리하시겠습니까?",
    );
    await waitFor(() => {
      expect(changeBulkOrderStatus).toHaveBeenCalledWith([1, 2], "조리중");
    });
  });

  test("선택한 주문 여러 건을 한 번에 취소한다", async () => {
    const secondOrder = {
      ...order,
      order_id: 2,
      order_number: "A-002",
      order_status: "조리중",
    };
    useAdminOrderStore.mockReturnValue({
      orders: [order, secondOrder],
      loadOrders,
      changeOrderStatus,
      changeBulkOrderStatus,
      cancelBulkOrders,
      cancelOrder,
    });
    renderPage();

    fireEvent.click(screen.getByLabelText("A-001 주문 선택"));
    fireEvent.click(screen.getByLabelText("A-002 주문 선택"));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "선택 주문 취소" }));
      await Promise.resolve();
    });

    expect(window.confirm).toHaveBeenCalledWith(
      "선택한 주문 2건을 취소하시겠습니까?\n환불 대상 2건 · 예상 환불 금액 13,000원\n결제 완료 건은 주문별로 전액 환불됩니다.",
    );
    await waitFor(() => {
      expect(cancelBulkOrders).toHaveBeenCalledWith([1, 2]);
    });
    expect(
      await screen.findByText("선택한 주문 2건이 취소되었습니다."),
    ).toBeTruthy();
  });

  test("결제 정보가 없는 선택 주문은 환불 대상 없음으로 안내한다", async () => {
    useAdminOrderStore.mockReturnValue({
      orders: [{ ...order, payment_method: "미확인" }],
      loadOrders,
      changeOrderStatus,
      changeBulkOrderStatus,
      cancelBulkOrders,
      cancelOrder,
    });
    renderPage();

    fireEvent.click(screen.getByLabelText("A-001 주문 선택"));
    fireEvent.click(screen.getByRole("button", { name: "선택 주문 취소" }));

    expect(window.confirm).toHaveBeenCalledWith(
      "선택한 주문 1건을 취소하시겠습니까?\n환불 대상 결제 정보가 없습니다.\n결제 완료 건은 주문별로 전액 환불됩니다.",
    );
    expect(
      await screen.findByText("선택한 주문 1건이 취소되었습니다."),
    ).toBeTruthy();
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
      "주문을 취소하시겠습니까?\n결제 완료 건은 자동으로 전액 환불됩니다.",
    );
    expect(
      await screen.findByText("완료된 주문은 취소할 수 없습니다."),
    ).toBeTruthy();
  });

  test("10초마다 갱신하고 신규 접수 주문이 생기면 알림음을 재생한다", async () => {
    jest.useFakeTimers();
    const newOrder = {
      ...order,
      order_id: 2,
      order_number: "A-002",
    };
    loadOrders
      .mockResolvedValueOnce([order])
      .mockResolvedValueOnce([newOrder, order]);

    renderPage();

    await act(async () => {
      await Promise.resolve();
    });

    expect(loadOrders).toHaveBeenCalledTimes(1);
    expect(playNewOrderSound).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "알림음 켜기" }));
      await Promise.resolve();
    });

    expect(playNewOrderSound).toHaveBeenCalledTimes(1);
    playNewOrderSound.mockClear();

    await act(async () => {
      jest.advanceTimersByTime(10000);
      await Promise.resolve();
    });

    expect(loadOrders).toHaveBeenCalledTimes(2);
    expect(playNewOrderSound).toHaveBeenCalledTimes(1);
    expect(screen.getByText("신규 1건")).toBeTruthy();
  });

  test("신규 주문을 열면 확인 처리하여 신규 건수를 줄인다", async () => {
    jest.useFakeTimers();
    loadOrders.mockResolvedValueOnce([]).mockResolvedValueOnce([order]);
    getOrderDetail.mockResolvedValue(detail);

    renderPage();

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      jest.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    expect(screen.getByText("신규 1건")).toBeTruthy();

    await act(async () => {
      fireEvent.click(screen.getByText("A-001"));
      await Promise.resolve();
    });

    expect(screen.getByText("신규 0건")).toBeTruthy();
  });

  test("신규 주문 상태가 변경되면 다음 갱신에서 신규 배지를 제거한다", async () => {
    jest.useFakeTimers();
    loadOrders
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([order])
      .mockResolvedValueOnce([{ ...order, order_status: "조리중" }]);

    renderPage();

    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      jest.advanceTimersByTime(5000);
      await Promise.resolve();
    });
    expect(screen.getByText("신규 1건")).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(5000);
      await Promise.resolve();
    });
    expect(screen.getByText("신규 0건")).toBeTruthy();
  });

  test("알림음 설정을 관리자 브라우저 세션에 저장한다", async () => {
    renderPage();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "알림음 켜기" }));
      await Promise.resolve();
    });

    expect(sessionStorage.getItem("adminOrderSoundEnabled")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "알림음 끄기" }));
    expect(sessionStorage.getItem("adminOrderSoundEnabled")).toBeNull();
  });

  test("접수 후 10분이 지난 주문을 처리 지연으로 표시한다", () => {
    const delayedOrder = {
      ...order,
      created_at: `${today} 00:00`,
    };
    useAdminOrderStore.mockReturnValue({
      orders: [delayedOrder],
      loadOrders,
      changeOrderStatus,
      cancelOrder,
    });

    renderPage();

    expect(screen.getByText("처리 지연 1건")).toBeTruthy();
    expect(screen.getByText("지연")).toBeTruthy();
  });

  test("현재 조회 날짜 밖의 지연 주문은 경고 건수에서 제외한다", () => {
    const oldOrder = {
      ...order,
      created_at: "2000-01-01 00:00",
    };
    useAdminOrderStore.mockReturnValue({
      orders: [oldOrder, { ...order, order_status: "완료" }],
      loadOrders,
      changeOrderStatus,
      cancelOrder,
    });

    renderPage();

    expect(screen.queryByText(/처리 지연/)).toBeNull();
  });

  test("주문번호로 현재 조회 조건 안에서 주문을 바로 찾는다", () => {
    const secondOrder = {
      ...order,
      order_id: 2,
      order_number: "B-245",
    };
    useAdminOrderStore.mockReturnValue({
      orders: [order, secondOrder],
      loadOrders,
      changeOrderStatus,
      changeBulkOrderStatus,
      cancelBulkOrders,
      cancelOrder,
    });

    renderPage();
    fireEvent.change(screen.getByRole("searchbox", { name: "주문번호 검색" }), {
      target: { value: "245" },
    });

    expect(screen.getByText("B-245")).toBeTruthy();
    expect(screen.queryByText("A-001")).toBeNull();
  });
});

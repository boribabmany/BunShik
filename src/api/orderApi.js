// 임시 주문 데이터 (백엔드 연동 전)

let orders = [
  {
    order_id: 1,
    order_number: "A-001",
    created_at: "2025-05-20 11:30",
    order_type: "포장",
    order_status: "완료",
    total_price: 9500,
  },
  {
    order_id: 2,
    order_number: "A-002",
    created_at: "2025-05-20 12:20",
    order_type: "매장",
    order_status: "완료",
    total_price: 10000,
  },
  {
    order_id: 3,
    order_number: "A-003",
    created_at: "2025-05-20 13:05",
    order_type: "포장",
    order_status: "접수",
    total_price: 8000,
  },
  {
    order_id: 4,
    order_number: "A-004",
    created_at: "2025-05-20 14:05",
    order_type: "포장",
    order_status: "조리중",
    total_price: 10000,
  },
  {
    order_id: 5,
    order_number: "A-005",
    created_at: "2025-05-20 14:50",
    order_type: "매장",
    order_status: "취소",
    total_price: 12000,
  },
];

// 주문 목록 조회
export const getOrders = async () => {
  return orders;
};

// 주문 상태 변경
export const updateOrderStatus = async (orderNumber) => {
  orders = orders.map((order) => {
    if (order.order_number !== orderNumber) return order;

    if (order.order_status === "접수") {
      return { ...order, order_status: "조리중" };
    }

    if (order.order_status === "조리중") {
      return { ...order, order_status: "완료" };
    }

    return order;
  });
};

// 주문 취소
export const cancelOrder = async (orderNumber) => {
  orders = orders.map((order) =>
    order.order_number === orderNumber
      ? { ...order, order_status: "취소" }
      : order
  );
};

/* 백엔드완성하면
import axiosInstance from "./axiosInstance";

export const getOrders = async () => {
  const res = await axiosInstance.get("/orders");
  return res.data;
};

export const updateOrderStatus = async (orderNumber) => {
  return axiosInstance.patch(`/orders/${orderNumber}/status`);
};

export const cancelOrder = async (orderNumber) => {
  return axiosInstance.patch(`/orders/${orderNumber}/cancel`);
};
*/ 
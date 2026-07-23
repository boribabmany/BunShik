import api from "./axios";


// 날짜 포맷 변환
const formatDateTime = (dateTime) => {
  if (!dateTime) return "";

  try {
    const date = new Date(dateTime);

    if (isNaN(date.getTime())) {
      return dateTime;
    }

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  } catch (error) {
    console.error("날짜 변환 오류:", dateTime);
    return dateTime;
  }
};


// 주문 목록 조회
export const getOrders = async () => {
  try {
    console.log("adminOrderApi getOrders 실행");

    const response = await api.get("/api/admin/orders");

    console.log("백엔드 응답:", response.data);

    return response.data.map((order) => ({
      order_id: order.orderId,
      order_number: order.orderNumber,
      created_at: formatDateTime(order.createdAt),
      order_type: order.orderType,
      order_status: order.orderStatus,
      total_price: order.totalPrice,
    }));

  } catch (error) {
    console.error("주문 목록 조회 실패:", error);
    throw error;
  }
};


// 주문 상태 변경
export const updateOrderStatus = async (orderId, orderStatus) => {
  try {
    const response = await api.patch(
      `/api/admin/orders/${orderId}/status`,
      {
        orderStatus,
      }
    );

    console.log("주문 상태 변경:", response.data);

    return response.data;

  } catch (error) {
    console.error("주문 상태 변경 실패:", error);
    throw error;
  }
};


// 주문 취소
export const cancelOrder = async (orderId) => {
  try {
    const response = await api.patch(
      `/api/admin/orders/${orderId}/cancel`
    );

    console.log("주문 취소:", response.data);

    return response.data;

  } catch (error) {
    console.error("주문 취소 실패:", error);
    throw error;
  }
};
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
  const response = await api.get("/api/admin/orders");

  return response.data.data.map((order) => ({
    order_id: order.orderId,
    order_number: order.orderNumber,
    created_at: formatDateTime(order.createdAt),
    order_type: order.orderType,
    order_status: order.orderStatus,
    total_price: order.totalPrice,
  }));
};

// 주문 상태 변경
export const getOrderDetail = async (orderId) => {
  const response = await api.get(`/api/admin/orders/${orderId}/detail`);
  const order = response.data.data;

  return {
    order_id: order.orderId,
    order_number: order.orderNumber,
    created_at: formatDateTime(order.createdAt),
    order_type: order.orderType,
    order_status: order.orderStatus,
    total_price: order.totalPrice,
    items: (order.items ?? []).map((item) => ({
      order_item_id: item.orderItemId,
      menu_name: item.menuName,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      options: (item.options ?? []).map((option) => ({
        option_id: option.optionId,
        option_name: option.optionName,
        option_price: option.optionPrice,
      })),
      components: (item.components ?? []).map((component) => ({
        component_menu_id: component.componentMenuId,
        component_menu_name: component.componentMenuName,
      })),
    })),
  };
};

export const updateOrderStatus = async (orderId, orderStatus) => {
  const response = await api.patch(`/api/admin/orders/${orderId}/status`, {
    orderStatus,
  });

  return response.data.data;
};

// 주문 취소
export const cancelOrder = async (orderId) => {
  const response = await api.patch(`/api/admin/orders/${orderId}/cancel`);

  return response.data.data;
};

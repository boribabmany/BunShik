import axios from "axios";

const ORDER_URL = "http://localhost:8080/api/orders";
const PAYMENT_URL = "http://localhost:8080/api/payments";

export const createOrder = async (request) => {
  try {
    const response = await axios.post(ORDER_URL, request);
    return response.data.data;
  } catch (error) {
    console.error("주문 생성 실패:", error);
    if (error.response)
      throw new Error(error.response.data.message || "SERVER_ERROR");
    if (error.request) throw new Error("NETWORK_ERROR");
    throw error;
  }
};

export const submitPayment = async (request) => {
  try {
    const response = await axios.post(PAYMENT_URL, request);
    return response.data.data;
  } catch (error) {
    console.error("결제 요청 실패:", error);
    if (error.response)
      throw new Error(error.response.data.message || "SERVER_ERROR");
    if (error.request) throw new Error("NETWORK_ERROR");
    throw error;
  }
};

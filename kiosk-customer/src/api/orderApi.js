import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

/**
 * 주문 + 결제 요청
 * @param {Object} request
 * @returns {Promise<Object>}
 */
export const submitPayment = async (request) => {
  try {
    const response = await axios.post(API_URL, request);

    // ApiResponse { success, data, message } 구조
    return response.data.data;
  } catch (error) {
    console.error("주문 요청 실패:", error);

    // 서버에서 응답을 준 경우
    if (error.response) {
      throw new Error(error.response.data.message || "SERVER_ERROR");
    }

    // 응답이 없는 경우(네트워크 오류)
    if (error.request) {
      throw new Error("NETWORK_ERROR");
    }

    throw error;
  }
};

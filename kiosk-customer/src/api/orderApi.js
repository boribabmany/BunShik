import axios from "axios";

const ORDER_URL = "http://localhost:8080/api/orders";
const PAYMENT_URL = "http://localhost:8080/api/payments";

const REQUEST_TIMEOUT = 8000; // 8초

/**
 * axios 에러를 프론트가 다루기 쉬운 형태로 정규화
 * error.failType: "timeout" | "network-error" | "server-error"
 */
function normalizeError(error) {
  if (error.code === "ECONNABORTED") {
    // 설정한 timeout(8초) 초과
    return Object.assign(new Error("TIMEOUT"), { failType: "timeout" });
  }

  if (error.response) {
    // 서버가 응답은 했지만 4xx/5xx (검증 실패, 서버 에러 등)
    return Object.assign(
      new Error(error.response.data?.message || "SERVER_ERROR"),
      { failType: "server-error" },
    );
  }

  if (error.request) {
    // 요청은 나갔지만 응답 자체가 안 옴 (서버 다운, 와이파이 끊김 등)
    return Object.assign(new Error("NETWORK_ERROR"), {
      failType: "network-error",
    });
  }

  return error;
}

/**
 * 재시도 가능한 에러(timeout, network-error)에 한해 자동 재시도
 * declined, card-error 등은 재시도해도 의미 없으므로 즉시 throw
 */
export async function withRetry(fn, { retries = 2, delayMs = 1000 } = {}) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      const retryable =
        error.failType === "timeout" || error.failType === "network-error";

      if (!retryable || attempt === retries) {
        throw error;
      }

      // 지수 백오프: 1차 1초, 2차 2초 대기 후 재시도
      await new Promise((resolve) =>
        setTimeout(resolve, delayMs * (attempt + 1)),
      );
    }
  }

  throw lastError;
}

/**
 * 1단계: 주문 생성
 * @param {Object} request - { items, order_type }
 * @returns {Promise<Object>} - { status, order_id, order_number, message }
 */
export const createOrder = async (request) => {
  try {
    const response = await axios.post(ORDER_URL, request, {
      timeout: REQUEST_TIMEOUT,
    });
    return response.data.data;
  } catch (error) {
    console.error("주문 생성 실패:", error);
    throw normalizeError(error);
  }
};

/**
 * 2단계: 결제 요청
 * @param {Object} request - { order_id, payment_method }
 * @returns {Promise<Object>} - { status, fail_type, fail_reason }
 */
export const submitPayment = async (request) => {
  try {
    const response = await axios.post(PAYMENT_URL, request, {
      timeout: REQUEST_TIMEOUT,
    });
    return response.data.data;
  } catch (error) {
    console.error("결제 요청 실패:", error);
    throw normalizeError(error);
  }
};

/**
 * 주문 취소 (결제 포기 시)
 * @param {number} orderId
 */
export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.patch(`${ORDER_URL}/${orderId}/cancel`, null, {
      timeout: REQUEST_TIMEOUT,
    });
    return response.data.data;
  } catch (error) {
    console.error("주문 취소 실패:", error);
    throw normalizeError(error);
  }
};

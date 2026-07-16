// ==========================================================
// 결제 시도 API
// status: 'success' | 'card-error' | 'declined'
// 시스템 예외(네트워크 등)는 reject로 던져서 Payment.jsx의
// try/catch에서 별도로 처리하도록 분리함.
// ==========================================================

// 지정된 시간(ms) 안에 응답이 없으면 강제로 실패 처리하는 유틸 함수.
// Promise.race: promise와 타이머 중 "먼저 끝나는 쪽"이 결과를 결정함.
const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), ms),
    ),
  ]);
};

// 실제 결제 요청 로직 (지금은 더미)
const requestPayment = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rand = Math.random();

      // 5% 확률로 네트워크 오류 흉내
      if (rand < 0.05) {
        reject(new Error("NETWORK_ERROR")); //시스템 오류(네트워크 오류)
        return;
      }

      if (rand < 0.4) {
        resolve({ status: "success" }); //성공
      } else if (rand < 0.7) {
        resolve({ status: "card-error" }); // 카드인식 오류
      } else {
        resolve({ status: "declined", fail_reason: "잔액부족" }); // 결제 거절
      }
    }, 800);
  });
};

// 외부(Payment.jsx)에서 호출하는 함수.
// 10초 안에 응답이 없으면 TIMEOUT 에러를 던짐.
export const submitPayment = async () => {
  return withTimeout(requestPayment(), 10000);
};

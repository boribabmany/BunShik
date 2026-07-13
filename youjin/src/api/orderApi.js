// 결제 시도를 흉내내는 더미 함수
// status: 'success' | 'card-error' | 'declined'
export const submitPayment = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rand = Math.random();
      if (rand < 0.34) {
        resolve({ status: "success" });
      } else if (rand < 0.67) {
        resolve({ status: "card-error" }); // IC 카드 인식 불가
      } else {
        resolve({ status: "declined", fail_reason: "잔액부족" }); // 카드사 승인 거절
      }
    }, 800);
  });
};

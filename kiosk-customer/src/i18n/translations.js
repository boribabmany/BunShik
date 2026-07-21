export const translations = {
  ko: {
    common: {
      back: "뒤로가기",
    },
    home: {
      guide1: "주문을 시작하려면",
      guide2: "아래 버튼을 눌러주세요",
      dineIn: "매장\n식사",
      takeout: "포장\n하기",
    },
    menu: {
      categories: {
        전체: "전체",
        떡볶이: "떡볶이",
        라면: "라면",
        김밥: "김밥",
        사이드: "사이드",
        음료: "음료",
      },
      prevCategory: "이전 카테고리 보기",
      nextCategory: "다음 카테고리 보기",
      loading: "메뉴를 불러오는 중입니다...",
      errorText: "메뉴를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
      retry: "다시 시도",
      empty: "표시할 메뉴가 없습니다.",
      soldOut: "품절",
      cartLabel: "장바구니",
      cartCount: (n) => `${n}개`,
      cartConfirm: "주문 확인",
    },
    option: {
      toppingAdd: "토핑 추가",
      maxSelect: (n) => `최대 ${n}개 선택`,
      addToCart: "메뉴 담기",
    },
    cart: {
      headerMenu: "메뉴",
      headerQty: "수량",
      headerPrice: "금액",
      headerDelete: "삭제",
      empty: "장바구니가 비어있습니다",
      totalLabel: "총 금액",
      moreMenu: "메뉴 더 담기",
      confirm: "결제 하기",
      deleteAlt: "삭제",
      qty: (n) => `${n}개`,
    },
    payment: {
      title: "주문내역",
      totalLabel: "총 결제 금액",
      selectMethod: "결제 수단 선택",
      paying: "결제 중...",
      qty: (n) => `${n}개`,
    },
    paymentMethod: {
      title: "결제 수단을 선택해주세요",
      naver: "네이버페이",
      kakao: "카카오페이",
      card: "카드 결제",
      cancel: "취소",
    },
    paymentFail: {
      cardErrorTitle: "결제 실패",
      declinedTitle: "결제 거절",
      timeoutTitle: "결제 응답 지연",
      systemErrorTitle: "일시적인 오류",
      cardErrorMessage:
        "IC 카드를 인식할 수 없습니다. 카드를 다시 삽입해 주세요. 계속 인식되지 않으면 카드를 긁어(MS) 결제하거나 다른 결제수단을 이용해 주세요.",
      declinedMessage: (reason) =>
        reason
          ? `카드사에서 결제를 승인하지 않았습니다 (${reason}). 다른 카드로 시도하시거나 카드사에 문의해 주세요.`
          : "카드사에서 결제를 승인하지 않았습니다. 다른 카드로 시도하시거나 카드사에 문의해 주세요.",
      timeoutMessage:
        "결제 응답이 지연되고 있습니다. 네트워크 상태를 확인하신 후 다시 시도해 주세요.",
      systemErrorMessage:
        "결제 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주시고, 계속되면 직원을 호출해 주세요.",
      back: "뒤로가기",
      backAlt: "돌아가기",
      retry: "재시도",
    },
    emptyCart: {
      title: "주문목록이 비어있습니다",
      subtitle: "메뉴화면으로 이동합니다",
      seconds: (n) => `(${n}초)`,
      confirm: "확인",
    },
    idleWarning: {
      title: "계속 이용하시겠습니까?",
      subtitle: "잠시 후 처음 화면으로 돌아갑니다",
      seconds: (n) => `(${n}초)`,
      continue: "계속 이용하기",
    },
    orderComplete: {
      title: "주문이 완료되었습니다!",
      subtitle1: "맛있게 준비해 드릴게요.",
      subtitle2: "잠시만 기다려주세요",
      orderNumberLabel: "주문번호",
      totalLabel: "총 결제 금액",
      printReceipt: "영수증 출력",
      printNumberOnly: "주문번호만 출력",
    },
  },
  en: {
    common: {
      back: "Back",
    },
    home: {
      guide1: "To start your order,",
      guide2: "please press the button below",
      dineIn: "Dine\nIn",
      takeout: "Take\nOut",
    },
    menu: {
      categories: {
        전체: "All",
        떡볶이: "Tteokbokki",
        라면: "Ramen",
        김밥: "Kimbap",
        사이드: "Sides",
        음료: "Drinks",
      },
      prevCategory: "View previous categories",
      nextCategory: "View next categories",
      loading: "Loading menu...",
      errorText: "Failed to load menu. Please try again.",
      retry: "Retry",
      empty: "No menu items to display.",
      soldOut: "Sold Out",
      cartLabel: "Cart",
      cartCount: (n) => `${n} items`,
      cartConfirm: "View Cart",
    },
    option: {
      toppingAdd: "Add Toppings",
      maxSelect: (n) => `Select up to ${n}`,
      addToCart: "Add to Cart",
    },
    cart: {
      headerMenu: "Item",
      headerQty: "Qty",
      headerPrice: "Price",
      headerDelete: "Delete",
      empty: "Your cart is empty",
      totalLabel: "Total",
      moreMenu: "More Items",
      confirm: "Checkout",
      deleteAlt: "Delete",
      qty: (n) => `${n}`,
    },
    payment: {
      title: "Order Summary",
      totalLabel: "Total Amount",
      selectMethod: "Select Payment Method",
      paying: "Processing...",
      qty: (n) => `${n}`,
    },
    paymentMethod: {
      title: "Select a payment method",
      naver: "Naver Pay",
      kakao: "Kakao Pay",
      card: "Card Payment",
      cancel: "Cancel",
    },
    paymentFail: {
      cardErrorTitle: "Payment Failed",
      declinedTitle: "Payment Declined",
      timeoutTitle: "Payment Delayed",
      systemErrorTitle: "Temporary Error",
      cardErrorMessage:
        "Unable to read the IC card. Please reinsert your card. If the problem continues, try swiping (MS) or use another payment method.",
      declinedMessage: (reason) =>
        reason
          ? `Your card issuer declined the payment (${reason}). Please try another card or contact your card issuer.`
          : "Your card issuer declined the payment. Please try another card or contact your card issuer.",
      timeoutMessage:
        "The payment response is delayed. Please check your network and try again.",
      systemErrorMessage:
        "An error occurred while processing your payment. Please try again, or call a staff member if this continues.",
      back: "Back",
      backAlt: "Go Back",
      retry: "Retry",
    },
    emptyCart: {
      title: "Your cart is empty",
      subtitle: "Returning to the menu screen",
      seconds: (n) => `(${n}s)`,
      confirm: "OK",
    },
    idleWarning: {
      title: "Would you like to continue?",
      subtitle: "You will be returned to the home screen shortly",
      seconds: (n) => `(${n}s)`,
      continue: "Continue",
    },
    orderComplete: {
      title: "Order Complete!",
      subtitle1: "We'll prepare it right away.",
      subtitle2: "Please wait a moment",
      orderNumberLabel: "Order Number",
      totalLabel: "Total Paid",
      printReceipt: "Print Receipt",
      printNumberOnly: "Print Number Only",
    },
  },
};

export const getLocalizedName = (language, koName, enName) => {
  if (language === "en" && enName) return enName;
  return koName;
};

// 가격을 언어에 맞는 통화 표기로 변환
// ko: "4,000원", en: "₩4,000"
export const formatPrice = (language, amount) => {
  const formatted = amount.toLocaleString();
  return language === "en" ? `₩${formatted}` : `${formatted}원`;
};

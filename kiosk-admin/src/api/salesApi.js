// salesApi.js
// 임시 매출 데이터 (백엔드 연동 전)

// 매출 요약
let salesSummary = {
  today_sales: 37500,
  today_order_count: 6,

  yesterday_sales: 980000,

  month_sales: 18420000,
  average_order_price: 18500,
  month_completed_order_count: 142,
};

// 인기 메뉴 TOP5
let popularMenus = [
  {
    menu_id: 1,
    menu_name: "떡볶이",
    order_count: 120,
  },
  {
    menu_id: 2,
    menu_name: "김밥",
    order_count: 96,
  },
  {
    menu_id: 3,
    menu_name: "순대",
    order_count: 83,
  },
  {
    menu_id: 4,
    menu_name: "튀김",
    order_count: 71,
  },
  {
    menu_id: 5,
    menu_name: "라면",
    order_count: 66,
  },
];

// 최근 30일 매출
let salesHistory = [
  {
    created_at: "2026-07-20",
    order_count: 6,
    total_price: 37500,
  },
  {
    created_at: "2026-07-19",
    order_count: 38,
    total_price: 980000,
  },
  {
    created_at: "2026-07-18",
    order_count: 44,
    total_price: 1310000,
  },
  {
    created_at: "2026-07-17",
    order_count: 35,
    total_price: 920000,
  },
  {
    created_at: "2026-07-16",
    order_count: 40,
    total_price: 1150000,
  },
];

// =========================
// 매출 요약 조회
// =========================
export const getSalesSummary = async () => {
  return salesSummary;
};

// =========================
// 인기 메뉴 조회
// =========================
export const getPopularMenus = async () => {
  return popularMenus;
};

// =========================
// 최근 30일 매출 조회
// =========================
export const getSalesHistory = async () => {
  return salesHistory;
};
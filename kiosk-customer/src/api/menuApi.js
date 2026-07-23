const API_BASE_URL = "http://localhost:8080";

export const getMenus = async () => {
  const res = await fetch(`${API_BASE_URL}/api/menus`);
  const data = await res.json();

  return data.data.map((menu) => ({
    ...menu,
    options: menu.options ?? [],
  }));
};

// 관리자 CRUD는 아직 백엔드 연동 전 - 팀원분이 admin API 완성하면 교체 예정
export const createMenu = async (menu) => {
  console.warn("createMenu는 아직 구현 전입니다.");
};

export const updateMenu = async (menu) => {
  console.warn("updateMenu는 아직 구현 전입니다.");
};

export const deleteMenu = async (menuId) => {
  console.warn("deleteMenu는 아직 구현 전입니다.");
};

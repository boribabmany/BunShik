import api from "./axios";

// 메뉴 조회
export const getMenus = async () => {
  const response = await api.get("/api/admin/menus");

  return response.data.map((menu) => ({
    menu_id: menu.menuId,
    menu_name: menu.menuName,
    category: menu.category,
    price: menu.price,
    image_url: menu.imageUrl,
    is_available: menu.isAvailable,
    status: menu.isAvailable ? "판매중" : "품절",
    description: menu.description,
    option_ids: [],
  }));
};

// 메뉴 등록
export const createMenu = async (menu) => {
  const request = {
    menuName: menu.menu_name,
    price: menu.price,
    category: menu.category,
    imageUrl: menu.image_url,
    description: menu.description,
    isAvailable: menu.is_available,
    soldOutReason: null,
  };

  const response = await api.post("/api/admin/menus", request);

  return response.data;
};

// 메뉴 수정
export const updateMenu = async (menuId, menu) => {
  const request = {
    menuName: menu.menu_name,
    price: menu.price,
    category: menu.category,
    imageUrl: menu.image_url,
    description: menu.description,
    isAvailable: menu.is_available,
    soldOutReason: null,
  };

  const response = await api.put(
    `/api/admin/menus/${menuId}`,
    request
  );

  return response.data;
};

// 메뉴 삭제
export const deleteMenu = async (menuId) => {
  const response = await api.delete(`/api/admin/menus/${menuId}`);

  return response.data;
};
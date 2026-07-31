import api from "./axios";
import { API_BASE_URL } from "../config/api";

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${API_BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
};

const mapMenu = (menu) => ({
  menu_id: menu.menuId,
  menu_name: menu.menuName,
  menu_name_en: menu.menuNameEn,
  category: menu.category,
  price: menu.price,
  image_url: getImageUrl(menu.imageUrl),
  is_available: menu.effectiveAvailable ?? menu.isAvailable,
  base_is_available: menu.isAvailable,
  is_visible: menu.isVisible,
  description: menu.description,
  description_en: menu.descriptionEn,
  option_ids: [],
});

// 메뉴 목록 조회
export const getMenus = async () => {
  const response = await api.get("/api/admin/menus");

  return response.data.data.map(mapMenu);
};

export const getSetComponents = async (menuId) => {
  const response = await api.get(`/api/admin/menus/${menuId}/components`);

  return response.data.data.map(mapMenu);
};

export const updateSetComponents = async (menuId, componentMenuIds) => {
  const response = await api.put(`/api/admin/menus/${menuId}/components`, {
    componentMenuIds,
  });

  return response.data.data;
};

// 메뉴 등록
export const createMenu = async (formData) => {
  const response = await api.post("/api/admin/menus", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

// 메뉴 수정
export const updateMenu = async (menuId, formData) => {
  const response = await api.put(`/api/admin/menus/${menuId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

// 메뉴 판매중단
export const stopMenu = async (menuId) => {
  const response = await api.patch(`/api/admin/menus/${menuId}/stop`);

  return response.data.data;
};

// 메뉴 판매재개
export const resumeMenu = async (menuId) => {
  const response = await api.patch(`/api/admin/menus/${menuId}/resume`);

  return response.data.data;
};

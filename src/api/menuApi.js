//목업
import { menus } from "../data/menus";

let menuData = [...menus];

// 조회
export const getMenus = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(menuData), 200);
  });
};

// 등록
export const createMenu = async (menu) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      menuData.push({
        ...menu,
        menu_id: Date.now(),
      });
      resolve();
    }, 200);
  });
};

// 수정
export const updateMenu = async (menu) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      menuData = menuData.map((m) =>
        m.menu_id === menu.menu_id ? menu : m
      );
      resolve();
    }, 200);
  });
};

// 삭제
export const deleteMenu = async (menuId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      menuData = menuData.filter(
        (m) => m.menu_id !== menuId
      );
      resolve();
    }, 200);
  });
};
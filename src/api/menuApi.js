//목업
import { menus } from "../data/menus";
import { getOptions } from "./optionApi";

let menuData = [...menus];

// 조회 (옵션까지 조립해서 반환)
export const getMenus = async () => {
  const optionList = await getOptions();

  const menusWithOptions = menuData.map((menu) => ({
    ...menu,
    options: (menu.option_ids || [])
    .map((id) => optionList.find((o) => o.option_id === id))
    .filter(Boolean),
    // 수정 options: menu.option_ids
    //   .map((id) => optionList.find((o) => o.option_id === id))
    //   .filter(Boolean),
  }));

  return new Promise((resolve) => {
    setTimeout(() => resolve(menusWithOptions), 200);
  });
};

// 등록
export const createMenu = async (menu) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId =
        menuData.length > 0
          ? Math.max(...menuData.map((m) => m.menu_id)) + 1
          : 1;

      menuData.push({
        ...menu,
        menu_id: newId,
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
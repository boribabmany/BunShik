import { menus } from "../data/menus";
import { getOptions } from "./optionApi";

let menuData = [...menus];

// 조회 (옵션까지 조립해서 반환)
export const getMenus = async () => {
  const optionList = await getOptions();

  const menusWithOptions = menuData.map((menu) => ({
    ...menu,
    options: menu.option_ids
      .map((id) => optionList.find((o) => o.option_id === id))
      .filter(Boolean),
  }));

  return new Promise((resolve) => {
    setTimeout(() => resolve(menusWithOptions), 200);
  });
};

/*
    백엔드 완성시 위에꺼 삭제 하고 주석 풀어서 사용
   */
// export const getMenus = async () => {
//   const res = await fetch("/api/menus");
//   const data = await res.json();
//   return data.map(mapServerMenuToFrontend);
// };

// const mapServerMenuToFrontend = (serverMenu) => ({
//   menu_id: serverMenu.id,
//   menu_name: serverMenu.name,
//   price: serverMenu.price,
//   category: serverMenu.category_name,
//   image_url: serverMenu.image_url,
//   is_available: serverMenu.is_active && !serverMenu.is_sold_out,
//   option_ids: serverMenu.options?.map((o) => o.id) ?? [],
// });

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
      menuData = menuData.map((m) => (m.menu_id === menu.menu_id ? menu : m));
      resolve();
    }, 200);
  });
};

// 삭제
export const deleteMenu = async (menuId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      menuData = menuData.filter((m) => m.menu_id !== menuId);
      resolve();
    }, 200);
  });
};

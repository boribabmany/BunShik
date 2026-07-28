import { create } from "zustand";
import { getMenus, createMenu, updateMenu, deleteMenu } from "../api/menuApi";

const useMenuStore = create((set) => ({
  menuList: [],

  // 메뉴 목록 조회
  loadMenus: async () => {
    const menus = await getMenus();

    set({
      menuList: menus,
    });
  },

  // 메뉴 등록 (파일 업로드 지원)
  addMenu: async (formData) => {
    await createMenu(formData);

    const menus = await getMenus();

    set({
      menuList: menus,
    });
  },

  // 메뉴 수정
  editMenu: async (menuId, formData) => {
    await updateMenu(menuId, formData);

    const menus = await getMenus();

    set({
      menuList: menus,
    });
  },

  // 메뉴 삭제
  removeMenu: async (menuId) => {
    await deleteMenu(menuId);

    const menus = await getMenus();

    set({
      menuList: menus,
    });
  },
}));

export default useMenuStore;

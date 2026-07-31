import { create } from "zustand";
import {
  getMenus,
  createMenu,
  updateMenu,
  getSetComponents,
  updateSetComponents,
  stopMenu,
  resumeMenu,
} from "../api/menuApi";

const useMenuStore = create((set) => ({
  menuList: [],

  // 메뉴 목록 조회
  loadMenus: async () => {
    const menus = await getMenus();

    set({
      menuList: menus,
    });
  },


  // 메뉴 등록
  addMenu: async (formData) => {
    const menuId = await createMenu(formData);

    const menus = await getMenus();

    set({
      menuList: menus,
    });

    return menuId;
  },


  // 메뉴 수정
  editMenu: async (menuId, formData) => {
    await updateMenu(menuId, formData);

    const menus = await getMenus();

    set({
      menuList: menus,
    });
  },

  loadSetComponents: async (menuId) => {
    return getSetComponents(menuId);
  },

  saveSetComponents: async (menuId, componentMenuIds) => {
    await updateSetComponents(menuId, componentMenuIds);

    const menus = await getMenus();
    set({ menuList: menus });
  },


  // 메뉴 판매중단
  stopMenu: async (menuId) => {
    await stopMenu(menuId);

    const menus = await getMenus();

    set({
      menuList: menus,
    });
  },


  // 메뉴 판매재개
  resumeMenu: async (menuId) => {
    await resumeMenu(menuId);

    const menus = await getMenus();

    set({
      menuList: menus,
    });
  },

}));

export default useMenuStore;

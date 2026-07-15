import { create } from "zustand";
import { getMenus, createMenu, updateMenu, deleteMenu, } from "../api/menuApi";

const useMenuStore = create((set) => ({
    menuList: [],

    loadMenus: async () => {
    const menus = await getMenus();
    set({ menuList: menus });
},
    addMenu: async (menu) => {
    await createMenu(menu);
    const menus = await getMenus();
    set({ menuList: menus });
},
    editMenu: async (menu) => {
    await updateMenu(menu);
    const menus = await getMenus();
    set({ menuList: menus });
},
    removeMenu: async (menuId) => {
    await deleteMenu(menuId);
    const menus = await getMenus();
    set({ menuList: menus });
},
}));

export default useMenuStore;
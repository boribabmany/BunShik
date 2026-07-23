import { create } from "zustand";
import { getMenus, createMenu, updateMenu, deleteMenu, } from "../api/menuApi";
import useHistoryStore from "./historyStore";

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
    useHistoryStore.getState().addHistory("메뉴 등록", `${menu.menu_name}이(가) 신규 등록되었습니다.`);
    },
    editMenu: async (menu) => {
    await updateMenu(menu.menu_id, menu);
    const menus = await getMenus();
    set({ menuList: menus });
    useHistoryStore.getState().addHistory(
    "메뉴 수정",
    `${menu.menu_name}이(가) 수정되었습니다.`);
    },
    removeMenu: async (menuId) => {
    await deleteMenu(menuId);
    const menus = await getMenus();
    set({ menuList: menus });
    useHistoryStore.getState().addHistory(
    "메뉴 삭제",
    `메뉴(ID: ${menuId})이(가) 삭제되었습니다.`
);
},


}));

export default useMenuStore;
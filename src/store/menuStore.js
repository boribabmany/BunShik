import { create } from "zustand";
import { getMenus, createMenu, updateMenu, deleteMenu, } from "../api/menuApi";
import useHistoryStore from "./historyStore";

const useMenuStore = create((set) => ({
    menuList: [],

    loadMenus: async () => {
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
//히스토리용
addMenu: async (menu) => {
await createMenu(menu);
const menus = await getMenus();
set({ menuList: menus });
//한줄추가해줌
useHistoryStore.getState().addHistory("메뉴 등록", `${menu.name}이(가) 신규 등록되었습니다.`);
},
}));

export default useMenuStore;
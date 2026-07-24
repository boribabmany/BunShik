import { create } from "zustand";
import {
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../api/menuApi";

import useHistoryStore from "./historyStore";


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
  addMenu: async (formData, menuName) => {

    await createMenu(formData);


    const menus = await getMenus();

    set({
      menuList: menus,
    });


    useHistoryStore
      .getState()
      .addHistory(
        "메뉴 등록",
        `${menuName}이(가) 신규 등록되었습니다.`
      );

  },


  // 메뉴 수정
  editMenu: async (menu) => {

    await updateMenu(
      menu.menu_id,
      menu
    );


    const menus = await getMenus();

    set({
      menuList: menus,
    });


    useHistoryStore
      .getState()
      .addHistory(
        "메뉴 수정",
        `${menu.menu_name}이(가) 수정되었습니다.`
      );

  },


  // 메뉴 삭제
  removeMenu: async (menuId) => {

    await deleteMenu(menuId);


    const menus = await getMenus();

    set({
      menuList: menus,
    });


    useHistoryStore
      .getState()
      .addHistory(
        "메뉴 삭제",
        `메뉴(ID: ${menuId})이(가) 삭제되었습니다.`
      );

  },


}));


export default useMenuStore;
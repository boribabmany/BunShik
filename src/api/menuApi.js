import { menus } from "../data/menus";

export const getMenus = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(menus), 200);
  });
};

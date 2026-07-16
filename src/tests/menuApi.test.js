import {
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../api/menuApi";

describe("menuApi", () => {
  test("메뉴 조회", async () => {
    const menus = await getMenus();

    expect(menus).toBeDefined();
    expect(Array.isArray(menus)).toBe(true);
    expect(menus.length).toBeGreaterThan(0);
  });

  test("메뉴 등록", async () => {
    const newMenu = {
      menu_name: "테스트메뉴",
      category: "테스트",
      price: 5000,
      image_url: "test.jpg",
      is_available: true,
    };

    await createMenu(newMenu);

    const menus = await getMenus();

    expect(
      menus.some((menu) => menu.menu_name === "테스트메뉴")
    ).toBe(true);
  });

  test("메뉴 수정", async () => {
    const menus = await getMenus();

    const menu = {
      ...menus[0],
      menu_name: "수정된메뉴",
    };

    await updateMenu(menu);

    const updatedMenus = await getMenus();

    expect(updatedMenus[0].menu_name).toBe("수정된메뉴");
  });

  test("메뉴 삭제", async () => {
    const menus = await getMenus();

    const deleteId = menus[0].menu_id;

    await deleteMenu(deleteId);

    const updatedMenus = await getMenus();

    expect(
      updatedMenus.find((menu) => menu.menu_id === deleteId)
    ).toBeUndefined();
  });
});
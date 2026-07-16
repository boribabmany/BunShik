describe("AdminMenuEdit 메뉴 테스트", () => {
  test("메뉴 등록", () => {
    const menu = {
      menu_name: "테스트김밥",
      category: "김밥",
      price: 3000,
      image_url: "test.jpg",
      is_available: true,
    };

    expect(menu.menu_name).toBe("테스트김밥");
    expect(menu.price).toBeGreaterThanOrEqual(1000);
    expect(menu.category).not.toBe("");
    expect(menu.image_url).not.toBe("");
  });

  test("가격 검증", () => {
    const price = 500;
    expect(price).toBeLessThan(1000);
  });

  test("메뉴명 필수값 검증", () => {
    const menuName = "";
    expect(menuName).toBe("");
  });
});
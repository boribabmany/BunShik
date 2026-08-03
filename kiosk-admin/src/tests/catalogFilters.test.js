import { filterMenus, filterOptions } from "../utils/catalogFilters";

const menus = [
  {
    menu_id: 1,
    menu_name: "참치김밥",
    menu_name_en: "Tuna Kimbap",
    category: "김밥",
    is_visible: true,
    is_available: true,
  },
  {
    menu_id: 2,
    menu_name: "라면",
    menu_name_en: "Ramen",
    category: "라면",
    is_visible: true,
    is_available: false,
  },
  {
    menu_id: 3,
    menu_name: "판매중단 메뉴",
    menu_name_en: "Stopped menu",
    category: "사이드",
    is_visible: false,
    is_available: true,
  },
];

const options = [
  {
    option_id: 10,
    option_name: "치즈 추가",
    option_name_en: "Extra cheese",
    is_visible: true,
    option_is_available: true,
  },
  {
    option_id: 11,
    option_name: "계란 추가",
    option_name_en: "Extra egg",
    is_visible: true,
    option_is_available: false,
  },
];

describe("catalogFilters", () => {
  test("메뉴 번호·한글명·영문명을 검색한다", () => {
    expect(filterMenus(menus, { query: "1" })).toEqual([menus[0]]);
    expect(filterMenus(menus, { query: "라면" })).toEqual([menus[1]]);
    expect(filterMenus(menus, { query: "stopped" })).toEqual([menus[2]]);
  });

  test("메뉴 카테고리와 판매상태를 함께 필터링한다", () => {
    expect(
      filterMenus(menus, { category: "김밥", status: "active" }),
    ).toEqual([menus[0]]);
    expect(filterMenus(menus, { status: "soldout" })).toEqual([menus[1]]);
    expect(filterMenus(menus, { status: "stopped" })).toEqual([menus[2]]);
  });

  test("옵션명과 판매상태를 필터링한다", () => {
    expect(filterOptions(options, { query: "CHEESE" })).toEqual([options[0]]);
    expect(filterOptions(options, { status: "soldout" })).toEqual([options[1]]);
  });
});

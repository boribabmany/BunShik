/**
 * 적용 화면: 관리자 메인·메뉴 편집 페이지 (/adminmenu, /adminmenuedit)
 * 테스트 내용: 메뉴 조회·등록·수정·판매 상태 및 세트 구성 API 처리를 검증한다.
 */
import api from "../api/axios";
import { API_BASE_URL } from "../config/api";
import {
  getMenus,
  createMenu,
  getSetComponents,
  updateSetComponents,
  updateMenu,
  stopMenu,
  resumeMenu,
} from "../api/menuApi";

jest.mock("../api/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  },
}));

describe("menuApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("메뉴 조회 응답을 화면용 데이터로 변환한다", async () => {
    api.get.mockResolvedValue({
      data: {
        data: [
          {
            menuId: 1,
            menuName: "떡볶이",
            menuNameEn: "Tteokbokki",
            menuType: "COMPONENT",
            category: "분식",
            price: 5000,
            imageUrl: "/images/tteokbokki.webp",
            isAvailable: true,
            effectiveAvailable: false,
            isVisible: true,
            description: "매운 떡볶이",
            descriptionEn: "Spicy rice cakes",
          },
        ],
      },
    });

    const menus = await getMenus();

    expect(api.get).toHaveBeenCalledWith("/api/admin/menus");
    expect(menus).toEqual([
      {
        menu_id: 1,
        menu_name: "떡볶이",
        menu_name_en: "Tteokbokki",
        menu_type: "COMPONENT",
        category: "분식",
        price: 5000,
        image_url: `${API_BASE_URL}/images/tteokbokki.webp`,
        is_available: false,
        base_is_available: true,
        is_visible: true,
        description: "매운 떡볶이",
        description_en: "Spicy rice cakes",
        option_ids: [],
      },
    ]);
  });

  test("세트 구성 메뉴를 조회해 화면용 데이터로 변환한다", async () => {
    api.get.mockResolvedValue({
      data: {
        data: [
          {
            menuId: 1,
            menuName: "떡볶이",
            category: "떡볶이",
            price: 5000,
            isAvailable: true,
            isVisible: true,
          },
        ],
      },
    });

    const components = await getSetComponents(10);

    expect(api.get).toHaveBeenCalledWith(
      "/api/admin/menus/10/components",
    );
    expect(components[0]).toMatchObject({
      menu_id: 1,
      menu_name: "떡볶이",
      base_is_available: true,
      is_available: true,
    });
  });

  test("선택한 세트 구성 메뉴 ID 목록을 저장한다", async () => {
    api.put.mockResolvedValue({ data: { data: 3 } });

    await expect(updateSetComponents(10, [1, 2, 3])).resolves.toBe(3);
    expect(api.put).toHaveBeenCalledWith(
      "/api/admin/menus/10/components",
      {
        componentMenuIds: [1, 2, 3],
      },
    );
  });

  test("메뉴 등록 요청을 전송하고 응답 데이터를 반환한다", async () => {
    const formData = new FormData();
    const createdMenu = { menuId: 2, menuName: "순대" };
    api.post.mockResolvedValue({ data: { data: createdMenu } });

    await expect(createMenu(formData)).resolves.toEqual(createdMenu);
    expect(api.post).toHaveBeenCalledWith("/api/admin/menus", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  });

  test("메뉴 수정 요청에 메뉴 ID와 폼 데이터를 전달한다", async () => {
    const formData = new FormData();
    const updatedMenu = { menuId: 1, menuName: "수정된 메뉴" };
    api.put.mockResolvedValue({ data: { data: updatedMenu } });

    await expect(updateMenu(1, formData)).resolves.toEqual(updatedMenu);
    expect(api.put).toHaveBeenCalledWith("/api/admin/menus/1", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  });

  test("메뉴 판매중단 요청을 전송하고 응답 데이터를 반환한다", async () => {
    api.patch.mockResolvedValue({ data: { data: 1 } });

    await expect(stopMenu(1)).resolves.toBe(1);
    expect(api.patch).toHaveBeenCalledWith("/api/admin/menus/1/stop");
  });

  test("메뉴 판매재개 요청을 전송하고 응답 데이터를 반환한다", async () => {
    api.patch.mockResolvedValue({ data: { data: 1 } });

    await expect(resumeMenu(1)).resolves.toBe(1);
    expect(api.patch).toHaveBeenCalledWith("/api/admin/menus/1/resume");
  });
});

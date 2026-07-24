import api from "./axios";


const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `http://localhost:8080${imageUrl}`;
};


// 메뉴 목록 조회
export const getMenus = async () => {

  const response = await api.get("/api/admin/menus");


  return response.data.map((menu) => ({
    menu_id: menu.menuId,
    menu_name: menu.menuName,
    category: menu.category,
    price: menu.price,
    image_url: getImageUrl(menu.imageUrl),
    is_available: menu.isAvailable,
    status: menu.isAvailable ? "판매중" : "품절",
    description: menu.description,
    option_ids: [],
  }));

};



// 메뉴 등록 (multipart)
export const createMenu = async (formData) => {

  const response = await api.post(
    "/api/admin/menus",
    formData,
    {
      headers:{
        "Content-Type":"multipart/form-data",
      },
    }
  );


  return response.data;

};



// 메뉴 수정 (multipart)
export const updateMenu = async (menuId, formData) => {

  const response = await api.put(
    `/api/admin/menus/${menuId}`,
    formData,
    {
      headers:{
        "Content-Type":"multipart/form-data",
      },
    }
  );


  return response.data;

};



// 메뉴 삭제
export const deleteMenu = async (menuId) => {

  const response = await api.delete(
    `/api/admin/menus/${menuId}`
  );


  return response.data;

};
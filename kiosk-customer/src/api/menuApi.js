const API_BASE_URL = "http://localhost:8080";

export const getMenus = async () => {
  const res = await fetch(`${API_BASE_URL}/api/menus`);
  const data = await res.json();

  return data.data.map((menu) => ({
    ...menu,
    options: menu.options ?? [],
  }));
};

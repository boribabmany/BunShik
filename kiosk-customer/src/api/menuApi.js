const API_BASE_URL = "http://localhost:8080";

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }
  return `${API_BASE_URL}${imageUrl}`;
};

export const getMenus = async () => {
  const res = await fetch(`${API_BASE_URL}/api/menus`);
  const data = await res.json();

  return data.data.map((menu) => ({
    ...menu,
    image_url: getImageUrl(menu.image_url),
    options: (menu.options ?? []).map((option) => ({
      ...option,
      option_image: getImageUrl(option.option_image),
    })),
  }));
};

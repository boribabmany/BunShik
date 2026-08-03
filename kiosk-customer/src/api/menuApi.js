const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
    set_components: (menu.set_components ?? []).map((component) => ({
      ...component,
      component_image_url: getImageUrl(component.component_image_url),
    })),
  }));
};

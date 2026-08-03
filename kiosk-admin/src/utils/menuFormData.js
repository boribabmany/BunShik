export const createMenuFormData = (
  menu,
  imageFile,
  componentMenuIds = [],
  componentSettings = {},
) => {
  const formData = new FormData();

  formData.append("menuName", menu.menu_name);
  formData.append("menuNameEn", menu.menu_name_en);
  formData.append("price", menu.price);
  formData.append("category", menu.category);
  formData.append("description", menu.description || "");
  formData.append("descriptionEn", menu.description_en || "");
  formData.append(
    "isAvailable",
    menu.base_is_available ?? menu.is_available,
  );

  if (menu.category?.trim() === "세트") {
    componentMenuIds.forEach((menuId) => {
      formData.append("componentMenuIds", menuId);
    });
    componentMenuIds.forEach((menuId, index) => {
      const setting = componentSettings[menuId] || {};
      formData.append(`componentSettings[${index}].componentMenuId`, menuId);
      formData.append(
        `componentSettings[${index}].selectGroup`,
        setting.select_group || "",
      );
      if (setting.select_group) {
        formData.append(
          `componentSettings[${index}].groupMaxSelect`,
          setting.group_max_select || 1,
        );
      }
      formData.append(
        `componentSettings[${index}].extraPrice`,
        setting.extra_price || 0,
      );
    });
  }

  if (imageFile) {
    formData.append("file", imageFile);
  }

  return formData;
};

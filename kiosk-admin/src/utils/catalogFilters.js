const normalize = (value) => String(value ?? "").trim().toLowerCase();

const matchesQuery = (item, fields, query) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;

  return fields.some((field) =>
    normalize(item[field]).includes(normalizedQuery),
  );
};

const matchesStatus = (item, availabilityField, status) => {
  if (status === "all") return true;
  if (status === "stopped") return !item.is_visible;
  if (status === "active") {
    return item.is_visible && Boolean(item[availabilityField]);
  }
  if (status === "soldout") {
    return item.is_visible && !item[availabilityField];
  }
  return true;
};

export const filterMenus = (
  menus,
  {
    query = "",
    category = "all",
    status = "all",
    includeId = true,
  } = {},
) =>
  menus.filter(
    (menu) =>
      matchesQuery(
        menu,
        includeId
          ? ["menu_id", "menu_name", "menu_name_en"]
          : ["menu_name", "menu_name_en"],
        query,
      ) &&
      (category === "all" || menu.category?.trim() === category) &&
      matchesStatus(menu, "is_available", status),
  );

export const filterOptions = (
  options,
  { query = "", status = "all", includeId = true } = {},
) =>
  options.filter(
    (option) =>
      matchesQuery(
        option,
        includeId
          ? ["option_id", "option_name", "option_name_en"]
          : ["option_name", "option_name_en"],
        query,
      ) && matchesStatus(option, "option_is_available", status),
  );

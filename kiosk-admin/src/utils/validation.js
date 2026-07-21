// 메뉴 검증
export function validateMenu(menu) {
  if (!menu) {
    return "등록할 메뉴 정보를 입력하세요.";
  }

  if (!menu.menu_name?.trim()) {
    return "메뉴명을 입력하세요.";
  }

  if (!menu.category?.trim()) {
    return "카테고리를 입력하세요.";
  }

  if (menu.price < 1000) {
    return "가격은 1000원 이상이어야 합니다.";
  }

  if (!menu.image_url) {
    return "메뉴 사진을 등록하세요.";
  }

  return null;
}

// 옵션 검증
export function validateOption(option) {
  if (!option) {
    return "등록할 옵션 정보를 입력하세요.";
  }

  if (!option.option_name?.trim()) {
    return "옵션메뉴명을 입력하세요.";
  }

  if (option.option_price < 1000) {
    return "옵션가격은 1000원 이상이어야 합니다.";
  }

  if (!option.option_image) {
    return "옵션 사진을 등록하세요.";
  }

  return null;
}
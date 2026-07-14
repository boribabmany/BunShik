import sundae from "../images/sundae.jpg";
import cola from "../images/cola.jpg";
import kimbab from "../images/kimbab.webp";
import odang from "../images/odang.jpg";
import ramen from "../images/ramen.jpg";
import tteokbokki from "../images/tteokbokki.webp";

export const menus = [
  {
    menu_id: 1,
    menu_name: "야채김밥",
    price: 2500,
    category: "김밥",
    image_url: kimbab,
    description: "",
    is_available: true,
    option_ids: [], // 옵션 없는 메뉴는 빈 배열
  },
  {
    menu_id: 2,
    menu_name: "라면",
    price: 3500,
    category: "라면",
    image_url: ramen,
    description: "매콤한 라면",
    is_available: true,
    option_ids: [1, 2], // options.js의 치즈(1), 계란(2) 참조
  },
  {
    menu_id: 3,
    menu_name: "떡볶이",
    price: 4000,
    category: "떡볶이",
    image_url: tteokbokki,
    description: "학교앞 달달하고 매콤한 추억의 떡볶이",
    is_available: true,
    option_ids: [1, 3], // 치즈(1), 라면사리(3)
  },
  {
    menu_id: 4,
    menu_name: "순대",
    price: 3000,
    category: "순대",
    image_url: sundae,
    description: "",
    is_available: true,
    option_ids: [],
  },
  {
    menu_id: 5,
    menu_name: "오뎅",
    price: 2000,
    category: "오뎅",
    image_url: odang,
    description: "",
    is_available: true,
    option_ids: [],
  },
  {
    menu_id: 6,
    menu_name: "콜라",
    price: 2000,
    category: "음료",
    image_url: cola,
    description: "",
    is_available: true,
    option_ids: [],
  },
];

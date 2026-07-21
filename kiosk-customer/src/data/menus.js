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
    menu_name_en: "Kimbap",
    price: 2500,
    category: "김밥",
    image_url: kimbab,
    description: "",
    description_en: "",
    is_available: true,
    option_ids: [],
  },
  {
    menu_id: 2,
    menu_name: "라면",
    menu_name_en: "Ramen",
    price: 3500,
    category: "라면",
    image_url: ramen,
    description: "매콤한 라면",
    description_en: "Spicy ramen noodles",
    is_available: true,
    option_ids: [1, 2],
  },
  {
    menu_id: 3,
    menu_name: "떡볶이",
    menu_name_en: "Tteokbokki",
    price: 4000,
    category: "떡볶이",
    image_url: tteokbokki,
    description: "학교앞 달달하고 매콤한 추억의 떡볶이",
    description_en:
      "Sweet and spicy rice cakes, just like from the old school days",
    is_available: true,
    option_ids: [1, 3],
  },
  {
    menu_id: 4,
    menu_name: "순대",
    menu_name_en: "Sundae",
    price: 3000,
    category: "사이드",
    image_url: sundae,
    description: "",
    description_en: "",
    is_available: true,
    option_ids: [],
  },
  {
    menu_id: 5,
    menu_name: "오뎅",
    menu_name_en: "Odeng",
    price: 2000,
    category: "사이드",
    image_url: odang,
    description: "",
    description_en: "",
    is_available: true,
    option_ids: [],
  },
  {
    menu_id: 6,
    menu_name: "콜라",
    menu_name_en: "Coke",
    price: 2000,
    category: "음료",
    image_url: cola,
    description: "",
    description_en: "",
    is_available: true,
    option_ids: [],
  },
];

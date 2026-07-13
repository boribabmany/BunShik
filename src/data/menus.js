import sundae from "../images/sundae.jpg";
import chesse from "../images/chesse.png";
import cola from "../images/cola.jpg";
import kimbab from "../images/kimbab.webp";
import odang from "../images/odang.jpg";
import ramen from "../images/ramen.jpg";
import ramensari from "../images/ramensari.jpg";
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
    options: [],
  },
  {
    menu_id: 2,
    menu_name: "라면",
    price: 3500,
    category: "라면",
    image_url: ramen,
    description: "매콤한 라면",
    is_available: true,
    options: [
      {
        option_id: 1,
        option_name: "치즈 추가",
        option_price: 1000,
        option_image: chesse,
      },
      {
        option_id: 2,
        option_name: "계란 추가",
        option_price: 1000,
        option_image: "",
      },
    ],
  },
  {
    menu_id: 3,
    menu_name: "떡볶이",
    price: 4000,
    category: "떡볶이",
    image_url: tteokbokki,
    description: "학교앞 달달하고 매콤한 추억의 떡볶이",
    is_available: true,
    options: [
      {
        option_id: 1,
        option_name: "치즈 추가",
        option_price: 1000,
        option_image: chesse,
      },
      {
        option_id: 3,
        option_name: "라면사리 추가",
        option_price: 1000,
        option_image: ramensari,
      },
    ],
  },
  {
    menu_id: 4,
    menu_name: "순대",
    price: 3000,
    category: "순대",
    image_url: sundae,
    description: "",
    is_available: true,
    options: [],
  },
  {
    menu_id: 5,
    menu_name: "오뎅",
    price: 2000,
    category: "오뎅",
    image_url: odang,
    description: "",
    is_available: true,
    options: [],
  },
  {
    menu_id: 6,
    menu_name: "콜라",
    price: 2000,
    category: "음료",
    image_url: cola,
    description: "",
    is_available: true,
    options: [],
  },
];

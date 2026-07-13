import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMenus } from "../../api/menuApi";
import useCartStore from "../../store/useCartStore";
import CategoryTabs from "../../components/kiosk/CategoryTabs";
import MenuCard from "../../components/kiosk/MenuCard";
import OptionModal from "../../components/kiosk/OptionModal";

function Menu() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [category, setCategory] = useState("전체");
  const [selectedMenu, setSelectedMenu] = useState(null);

  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    getMenus().then(setMenus);
  }, []);

  const filteredMenus =
    category === "전체"
      ? menus
      : menus.filter((menu) => menu.category === category);

  const handleMenuClick = (menu) => {
    if (menu.options && menu.options.length > 0) {
      setSelectedMenu(menu);
    } else {
      addItem({
        menu_id: menu.menu_id,
        menu_name: menu.menu_name,
        base_price: menu.price,
        quantity: 1,
        options: [],
      });
    }
  };

  const cartCount = items.length;
  const cartTotal = items.reduce((sum, item) => {
    const optionTotal = item.options.reduce((s, o) => s + o.option_price, 0);
    return sum + (item.base_price + optionTotal) * item.quantity;
  }, 0);

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)}>
        뒤로가기
      </button>

      <CategoryTabs selected={category} onSelect={setCategory} />

      <div>
        {filteredMenus.map((menu) => (
          <MenuCard
            key={menu.menu_id}
            menu={menu}
            onClick={() => handleMenuClick(menu)}
          />
        ))}
      </div>

      <div>
        <span>장바구니 {cartCount}개</span>
        <span>{cartTotal.toLocaleString()}원</span>
        <button type="button" onClick={() => navigate("/cart")}>
          주문 확인
        </button>
      </div>

      {selectedMenu && (
        <OptionModal
          menu={selectedMenu}
          onClose={() => setSelectedMenu(null)}
          onAdd={addItem}
        />
      )}
    </div>
  );
}

export default Menu;

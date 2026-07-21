import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMenus } from "../../api/menuApi";
import useCartStore from "../../store/useCartStore";
import CategoryTabs from "../../components/kiosk/CategoryTabs";
import MenuCard from "../../components/kiosk/MenuCard";
import OptionModal from "../../components/kiosk/OptionModal";
import CartBar from "../../components/kiosk/CartBar";
import logo from "../../images/bunshiklogo.png";
import "../../styles/common.css";
import "../../styles/Menu.css";
function Menu() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [category, setCategory] = useState("전체");
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const fetchMenus = () => {
    setIsLoading(true);
    setIsError(false);

    getMenus()
      .then(setMenus)
      .catch((error) => {
        console.error("메뉴 조회 실패:", error);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchMenus();
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
        image_url: menu.image_url,
        base_price: menu.price,
        quantity: 1,
        options: [],
      });
    }
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = getTotalPrice();

  return (
    <div className="menu-screen">
      <button
        type="button"
        className="menu-back-button"
        onClick={() => navigate(-1)}
      >
        <span className="menu-back-icon" />
        <span className="menu-back-text">뒤로가기</span>
      </button>

      <img src={logo} alt="분식집 로고" className="menu-logo" />

      <CategoryTabs selected={category} onSelect={setCategory} />

      {isLoading ? (
        <p>메뉴를 불러오는 중입니다...</p>
      ) : isError ? (
        <div>
          <p>메뉴를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>
          <button type="button" onClick={fetchMenus}>
            다시 시도
          </button>
        </div>
      ) : filteredMenus.length === 0 ? (
        <p>표시할 메뉴가 없습니다.</p>
      ) : (
        <div className="menu-card-grid">
          {filteredMenus.map((menu) => (
            <MenuCard
              key={menu.menu_id}
              menu={menu}
              onClick={() => handleMenuClick(menu)}
            />
          ))}
        </div>
      )}

      <CartBar
        count={cartCount}
        total={cartTotal}
        onCheckClick={() => navigate("/cart")}
        disabled={cartCount === 0}
      />

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

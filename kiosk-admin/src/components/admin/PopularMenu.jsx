import { useEffect } from "react";
import useSalesStore from "../../store/salesStore";

export default function PopularMenu() {
  const { popularMenus, loadPopularMenus } = useSalesStore();

  useEffect(() => {
    loadPopularMenus();
  }, [loadPopularMenus]);

  return (
    <div className="popular-menu">
      <h2> 한달 간 인기 메뉴 TOP 5</h2>

      <ul className="popular-menu-list">
        {popularMenus.map((menu) => (
          <li key={menu.menu_id} className="popular-menu-item">
            <span>
              {menu.rank}. {menu.menu_name}
            </span>

            <strong>{menu.order_count}개</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
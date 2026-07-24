import { useEffect } from "react";
import useSalesStore from "../../store/salesStore";

export default function PopularMenu() {
  const { popularMenus, loadPopularMenus } = useSalesStore();

  useEffect(() => {
    loadPopularMenus();
  }, [loadPopularMenus]);

  return (
    <div className="popular-menu">
      <h2>한달 간 인기 메뉴 TOP 5</h2>

      <ul className="popular-menu-list">
        {popularMenus.map((menu, index) => (
          <li key={index} className="popular-menu-item">
            <span>
              {index + 1}. {menu.menuName}
            </span>

            <strong>
              {menu.orderCount}개
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
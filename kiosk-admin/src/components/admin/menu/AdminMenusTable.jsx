// adminmenu 메뉴테이블
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useMenuStore from "../../../store/menuStore";
import { filterMenus } from "../../../utils/catalogFilters";

export default function AdminMenusTable({ onImageClick }) {
  const navigate = useNavigate();
  const menuList = useMenuStore((state) => state.menuList);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const salesMenus = useMemo(
    () => menuList.filter((menu) => menu.menu_type !== "COMPONENT"),
    [menuList],
  );
  const categories = useMemo(
    () =>
      [
        ...new Set(
          salesMenus.map((menu) => menu.category?.trim()).filter(Boolean),
        ),
      ]
        .sort((a, b) => a.localeCompare(b, "ko")),
    [salesMenus],
  );
  const filteredMenus = filterMenus(salesMenus, { query, category, status });
  const setMenus = filteredMenus.filter(
    (menu) => menu.category?.trim() === "세트",
  );
  const regularMenus = filteredMenus.filter(
    (menu) => menu.category?.trim() !== "세트",
  );

  const renderMenuTable = (title, menus) => (
    <section className="admin-menu-section">
      <h3 className="menu-section-title">{title}</h3>
      <table className="menu-table">
        <thead>
          <tr>
            <th>사진</th>
            <th>메뉴명</th>
            <th>카테고리</th>
            <th>가격</th>
            <th>판매상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {menus.length === 0 ? (
            <tr>
              <td colSpan="6" className="menu-empty-message">
                등록된 {title}가 없습니다.
              </td>
            </tr>
          ) : (
            menus.map((menu) => (
              <tr
                key={menu.menu_id}
                className={!menu.is_visible ? "menu-stopped-row" : ""}
              >
                <td>
                  {menu.image_url ? (
                    <button
                      type="button"
                      className="image-preview-trigger"
                      aria-label={`${menu.menu_name} 사진 확대`}
                      onClick={() =>
                        onImageClick?.(menu.image_url, menu.menu_name)
                      }
                    >
                      <img src={menu.image_url} alt={menu.menu_name} />
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
                <td>{menu.menu_name}</td>
                <td>{menu.category}</td>
                <td>{menu.price.toLocaleString()}원</td>
                <td>
                  <span
                    className={`menu-status-badge ${
                      !menu.is_visible
                        ? "menu-status-stopped"
                        : menu.is_available
                          ? "menu-status-active"
                          : "menu-status-soldout"
                    }`}
                  >
                    {!menu.is_visible
                      ? "판매중단"
                      : menu.is_available
                        ? "판매중"
                        : "품절"}
                  </span>
                </td>
                <td>
                  <button
                    className="menu-edit-btn"
                    disabled={!menu.is_visible}
                    title={
                      menu.is_visible
                        ? "메뉴 수정"
                        : "판매재개 후 수정할 수 있습니다."
                    }
                    onClick={() =>
                      navigate("/adminmenuedit", {
                        state: { type: "menu", item: menu },
                      })
                    }
                  >
                    수정
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );

  return (
    <div className="menu-table-box">
      <div className="catalog-list-header">
        <h2 className="table-title">메뉴 리스트</h2>
        <span className="catalog-result-count">
          {filteredMenus.length}/{salesMenus.length}개
        </span>
      </div>
      <div className="catalog-filter-bar" aria-label="메뉴 검색 및 필터">
        <input
          type="search"
          value={query}
          placeholder="메뉴명 검색"
          aria-label="메뉴 검색"
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="catalog-category-tabs" aria-label="메뉴 카테고리">
          <button
            type="button"
            className={category === "all" ? "active" : ""}
            aria-pressed={category === "all"}
            onClick={() => setCategory("all")}
          >
            전체
          </button>
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={category === item ? "active" : ""}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <select
          value={status}
          aria-label="메뉴 판매상태 필터"
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="all">전체 상태</option>
          <option value="active">판매중</option>
          <option value="soldout">품절</option>
          <option value="stopped">판매중단</option>
        </select>
      </div>
      <div className="menu-table-scroll">
        {renderMenuTable("세트 메뉴", setMenus)}
        {renderMenuTable("일반 메뉴", regularMenus)}
      </div>
    </div>
  );
}

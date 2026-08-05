import { useEffect, useMemo, useState } from "react";
import { filterMenus } from "../../../utils/catalogFilters";

const MENU_PER_PAGE = 5;
const FEATURED_MENU_PER_PAGE = 3;

export default function MenuListSection({
  menus, onAddMenu, onAddSetMenu, onAddComponentMenu, onEdit, onToggleVisibility, onImageClick,
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [menuPage, setMenuPage] = useState(1);
  const [setListPage, setSetListPage] = useState(1);
  const [componentPage, setComponentPage] = useState(1);
  const categories = useMemo(
    () =>
      [...new Set(menus.map((menu) => menu.category?.trim()).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "ko")),
    [menus],
  );
  const filteredMenus = filterMenus(menus, {
    query, category, status, includeId: false,
  });
  const componentMenus = filteredMenus.filter(
    (menu) => menu.menu_type === "COMPONENT",
  );
  const regularMenus = filteredMenus.filter(
    (menu) =>
      menu.menu_type !== "COMPONENT" && menu.category?.trim() !== "세트",
  );
  const setMenus = filteredMenus.filter(
    (menu) =>
      menu.menu_type !== "COMPONENT" && menu.category?.trim() === "세트",
  );
  const currentMenus = regularMenus.slice(
    (menuPage - 1) * MENU_PER_PAGE,
    menuPage * MENU_PER_PAGE,
  );
  const currentSetMenus = setMenus.slice(
    (setListPage - 1) * FEATURED_MENU_PER_PAGE,
    setListPage * FEATURED_MENU_PER_PAGE,
  );
  const currentComponentMenus = componentMenus.slice(
    (componentPage - 1) * FEATURED_MENU_PER_PAGE,
    componentPage * FEATURED_MENU_PER_PAGE,
  );
  const menuTotalPages = Math.ceil(regularMenus.length / MENU_PER_PAGE);
  const setMenuTotalPages = Math.ceil(
    setMenus.length / FEATURED_MENU_PER_PAGE,
  );
  const componentTotalPages = Math.ceil(
    componentMenus.length / FEATURED_MENU_PER_PAGE,
  );

  useEffect(() => {
    setMenuPage(1);
    setSetListPage(1);
    setComponentPage(1);
  }, [query, category, status]);

  const renderRows = (items, emptyMessage) => {
    if (items.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="empty-table-message">
            {emptyMessage}
          </td>
        </tr>
      );
    }

    return items.map((menu) => (
      <tr
        key={menu.menu_id}
        className={!menu.is_visible ? "stopped-row" : ""}
      >
        <td>
          {menu.image_url ? (
            <button
              type="button"
              className="image-preview-trigger"
              aria-label={`${menu.menu_name} 사진 확대`}
              onClick={() => onImageClick(menu.image_url, menu.menu_name)}
            >
              <img src={menu.image_url} alt={menu.menu_name} />
            </button>
          ) : (
            "-"
          )}
        </td>
        <td>{menu.menu_name}</td>
        <td>{menu.menu_name_en || "-"}</td>
        <td>{menu.category}</td>
        <td>{menu.price.toLocaleString()}원</td>
        <td>
          <span
            className={`status-badge ${
              !menu.is_visible
                ? "status-stopped"
                : menu.is_available
                  ? "status-active"
                  : "status-soldout"
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
            disabled={!menu.is_visible}
            title={
              menu.is_visible ? "메뉴 수정" : "판매재개 후 수정할 수 있습니다."
            }
            onClick={() => onEdit("menu", menu)}
          >
            수정
          </button>
          <button
            className={`visibility-toggle-btn ${
              menu.is_visible ? "stop-btn" : "resume-btn"
            }`}
            onClick={() => onToggleVisibility(menu)}
          >
            {menu.is_visible ? "판매중단" : "판매재개"}
          </button>
        </td>
      </tr>
    ));
  };

  const renderPagination = (totalPages, currentPage, onPageChange) => (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          className={currentPage === index + 1 ? "active" : ""}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );

  return (
    <section className="catalog-management-section">
      <div className="edit-filter-group">
        <div className="edit-filter-heading">
          <strong>메뉴 검색·필터</strong>
          <span>{filteredMenus.length}/{menus.length}개</span>
        </div>
        <div className="edit-filter-controls menu-filter-controls">
          <input
            type="search"
            value={query}
            placeholder="메뉴명 검색"
            aria-label="메뉴관리 메뉴 검색"
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            value={category}
            aria-label="메뉴관리 카테고리 필터"
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">전체 카테고리</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={status}
            aria-label="메뉴관리 판매상태 필터"
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="all">전체 상태</option>
            <option value="active">판매중</option>
            <option value="soldout">품절</option>
            <option value="stopped">판매중단</option>
          </select>
        </div>
      </div>

      <div className="featured-menu-grid">
        <div className="featured-menu-column">
          <div className="register-button-area">
            <button
              className="register-btn set-register-btn"
              onClick={onAddSetMenu}
            >
              + 세트 등록
            </button>
          </div>
          <div className="edit-table-box">
            <h3 className="table-section-title">세트 메뉴</h3>
            <table className="edit-table">
              <thead>
                <tr>
                  <th>사진</th>
                  <th>메뉴명</th>
                  <th>영문명</th>
                  <th>카테고리</th>
                  <th>가격</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {renderRows(currentSetMenus, "등록된 세트 메뉴가 없습니다.")}
              </tbody>
            </table>
            {renderPagination(setMenuTotalPages, setListPage, setSetListPage)}
          </div>
        </div>

        <div className="featured-menu-column">
          <div className="register-button-area">
            <button className="register-btn" onClick={onAddComponentMenu}>
              + 구성품 등록
            </button>
          </div>
          <div className="edit-table-box">
            <h3 className="table-section-title">구성 전용 메뉴</h3>
            <table className="edit-table">
              <thead>
                <tr>
                  <th>사진</th>
                  <th>메뉴명</th>
                  <th>영문명</th>
                  <th>카테고리</th>
                  <th>가격</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {renderRows(
                  currentComponentMenus,
                  "등록된 구성 전용 메뉴가 없습니다.",
                )}
              </tbody>
            </table>
            {renderPagination(
              componentTotalPages,
              componentPage,
              setComponentPage,
            )}
          </div>
        </div>
      </div>

      <div className="register-button-area">
        <button className="register-btn" onClick={onAddMenu}>
          + 메뉴 등록
        </button>
      </div>
      <div className="edit-table-box">
        <h3 className="table-section-title">일반 메뉴</h3>
        <table className="edit-table">
          <thead>
            <tr>
              <th>사진</th>
              <th>메뉴명</th>
              <th>영문명</th>
              <th>카테고리</th>
              <th>가격</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {renderRows(currentMenus, "등록된 일반 메뉴가 없습니다.")}
          </tbody>
        </table>
        {renderPagination(menuTotalPages, menuPage, setMenuPage)}
      </div>
    </section>
  );
}

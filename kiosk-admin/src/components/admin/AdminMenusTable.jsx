// adminmenu 메뉴테이블
import { useNavigate } from "react-router-dom";
import useMenuStore from "../../store/menuStore";

export default function AdminMenusTable({ onImageClick }) {
  const navigate = useNavigate();
  const menuList = useMenuStore((state) => state.menuList);

  return (
    <div className="menu-table-box">
      <h2 className="table-title">메뉴 리스트</h2>
      <div className="menu-table-scroll">
        <table className="menu-table">
          <thead>
            <tr>
              <th className="number-col">메뉴번호</th>
              <th>사진</th>
              <th>메뉴명</th>
              <th>카테고리</th>
              <th>가격</th>
              <th>판매상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {menuList.map((menu) => (
              <tr
                key={menu.menu_id}
                className={!menu.is_visible ? "menu-stopped-row" : ""}
              >
                <td className="number-col">{menu.menu_id}</td>
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
                  {" "}
                  <button
                    className="menu-edit-btn"
                    onClick={() =>
                      navigate("/adminmenuedit", {
                        state: { type: "menu", item: menu },
                      })
                    }
                  >
                    {" "}
                    수정
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

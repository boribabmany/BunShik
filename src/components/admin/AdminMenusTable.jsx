// adminmenu 메뉴테이블

import { useNavigate } from "react-router-dom";
import useMenuStore from "../../store/menuStore";

export default function AdminMenusTable() {
  const navigate = useNavigate();
  const { menuList } = useMenuStore();

  // DB 연결 전 목업 데이터
  return (
    <div className="menu-table-box">
      <h2 className="table-title">메뉴 리스트</h2>

      <div className="table-scroll">
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
            <tr key={menu.menu_id}>

              <td className="number-col">{menu.menu_id}</td>
              <td> <img src={menu.image_url} alt={menu.menu_name}/></td>
              <td>{menu.menu_name}</td>
              <td>{menu.category}</td>
              <td>{menu.price.toLocaleString()}원</td>
              <td>{menu.is_available ? "판매중" : "품절"}</td>
              <td> <button className="menu-edit-btn" onClick={() => navigate("/adminmenuedit")}>
                      수정
                    </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 하단 버튼 */}
      <div className="table-button-area">
        <button className="menu-edit-btn" onClick={() => navigate("/adminmenuedit")}>
          메뉴 수정
        </button>
      </div>
      </div>
    </div>
  );
}
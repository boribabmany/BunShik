// adminmenu 메뉴테이블

import { useNavigate } from "react-router-dom";
import { menus } from "../../data/menus";
export default function AdminMenusTable() {
  const navigate = useNavigate();

  // DB 연결 전 목업 데이터

  return (
    <div>
      <h2>메뉴 리스트</h2>
      <table border="1">
        <thead>
          <tr>
            <th>메뉴번호</th>
            <th>사진</th>
            <th>메뉴명</th>
            <th>카테고리</th>
            <th>가격</th>
            <th>판매상태</th>
          </tr>
        </thead>

        <tbody>
  {menus.map((menu) => (
    <tr key={menu.menu_id}>
      <td>{menu.menu_id}</td>
      <td>
  <img
    src={menu.image_url}
    alt={menu.menu_name}
    width={60}
    height={60}
  />
  <div>{menu.image}</div> 
</td>
      <td>{menu.menu_name}</td>
      <td>{menu.category}</td>
      <td>{menu.price.toLocaleString()}원</td>
      <td>{menu.is_available ? "판매중" : "품절"}</td>
    </tr>
  ))}
</tbody>
      </table>

      {/* 하단 오른쪽 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "15px",
        }}
      >
        <button onClick={() => navigate("/adminmenuedit")}>
          메뉴 수정(임시 다음페이지가는 버튼이다수라 하나로 줄일까고민중)
        </button>
      </div>
    </div>
  );
}
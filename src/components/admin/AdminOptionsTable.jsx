// adminmenu 옵션테이블

import { useNavigate } from "react-router-dom";
import { options } from "../../data/options";
export default function AdminOptionsTable() {
  const navigate = useNavigate();

  // DB 연결 전 목업 데이터

  return (
    <div>
      <h2>옵션 리스트</h2>

      <table border="1">
        <thead>
          <tr>
            <th>옵션번호</th>
            <th>사진</th>
            <th>옵션명</th>
            <th>추가금액</th>
            <th>판매상태</th>
          </tr>
        </thead>

        <tbody>
  {options.map((option) => (
    <tr key={option.option_id}>
      <td>{option.option_id}</td>
      <td>
        <img
          src={option.option_image}
          alt={option.option_name}
          width={60}
          height={60}
          style={{
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      </td>
      <td>{option.option_name}</td>
      <td>+{option.option_price.toLocaleString()}원</td>
      <td>{option.option_is_available ? "판매중" : "품절"}</td>
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
          옵션 수정
        </button>
      </div>
    </div>
  );
}
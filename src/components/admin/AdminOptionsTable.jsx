// adminmenu 옵션테이블

import { useNavigate } from "react-router-dom";
import useOptionStore from "../../store/optionStore";

export default function AdminOptionsTable() {
  const navigate = useNavigate();
  const { optionList } = useOptionStore();

  return (
    <div className="option-table-box">
      <h2 className="table-title">옵션 리스트</h2>

      <div className="table-scroll">
        <table className="menu-table">
          <thead>
            <tr>
              <th className="number-col">옵션번호</th>
              <th>사진</th>
              <th>옵션명</th>
              <th>추가금액</th>
              <th>판매상태</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {optionList.map((option) => (
              <tr key={option.option_id}>
                <td className="number-col">{option.option_id}</td>
                <td>
                  <img src={option.option_image} alt={option.option_name}/>
                </td>
                <td>{option.option_name}</td>
                <td>{option.option_price.toLocaleString()}원</td>
                <td>{option.option_is_available ? "판매중" : "품절"}</td>
                <td>
                  <button className="option-edit-btn"
                    onClick={() => navigate("/adminmenuedit", {state: { type: "option", item: option,},
                    })}>수정
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 하단 버튼 */}
        <div className="table-button-area">
          <button className="option-edit-btn" onClick={() => navigate("/adminmenuedit")}>
            옵션 수정
          </button>
        </div>
      </div>
    </div>
  );
}
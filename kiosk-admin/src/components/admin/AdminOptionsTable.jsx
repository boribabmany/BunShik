// adminmenu 옵션테이블

import { useNavigate } from "react-router-dom";
import useOptionStore from "../../store/optionStore";

export default function AdminOptionsTable({ onImageClick }) {
  const navigate = useNavigate();
  const optionList = useOptionStore((state) => state.optionList);

  return (
    <div className="option-table-box">
      <h2 className="table-title">옵션 리스트</h2>

      <div className="option-table-scroll">
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
              <tr
                key={option.option_id}
                className={!option.is_visible ? "menu-stopped-row" : ""}
              >
                <td className="number-col">{option.option_id}</td>
                <td>
                  {option.option_image ? (
                    <button
                      type="button"
                      className="image-preview-trigger"
                      aria-label={`${option.option_name} 사진 확대`}
                      onClick={() =>
                        onImageClick?.(option.option_image, option.option_name)
                      }
                    >
                      <img src={option.option_image} alt={option.option_name} />
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
                <td>{option.option_name}</td>
                <td>{option.option_price.toLocaleString()}원</td>
                <td>
                  <span
                    className={`menu-status-badge ${
                      !option.is_visible
                        ? "menu-status-stopped"
                        : option.option_is_available
                          ? "menu-status-active"
                          : "menu-status-soldout"
                    }`}
                  >
                    {!option.is_visible
                      ? "판매중단"
                      : option.option_is_available
                        ? "판매중"
                        : "품절"}
                  </span>
                </td>
                <td>
                  <button
                    className="option-edit-btn"
                    disabled={!option.is_visible}
                    title={
                      option.is_visible
                        ? "옵션 수정"
                        : "판매재개 후 수정할 수 있습니다."
                    }
                    onClick={() =>
                      navigate("/adminmenuedit", {
                        state: { type: "option", item: option },
                      })
                    }
                  >
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

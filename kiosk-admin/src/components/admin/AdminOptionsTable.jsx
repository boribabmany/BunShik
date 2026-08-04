// adminmenu 옵션테이블

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useOptionStore from "../../store/optionStore";
import { filterOptions } from "../../utils/catalogFilters";

export default function AdminOptionsTable({ onImageClick }) {
  const navigate = useNavigate();
  const optionList = useOptionStore((state) => state.optionList);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const filteredOptions = filterOptions(optionList, { query, status });

  return (
    <div className="option-table-box">
      <div className="catalog-list-header">
        <h2 className="table-title">옵션 리스트</h2>
        <span className="catalog-result-count">
          {filteredOptions.length}/{optionList.length}개
        </span>
      </div>
      <div className="catalog-filter-bar" aria-label="옵션 검색 및 필터">
        <input
          type="search"
          value={query}
          placeholder="옵션명 검색"
          aria-label="옵션 검색"
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          value={status}
          aria-label="옵션 판매상태 필터"
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="all">전체 상태</option>
          <option value="active">판매중</option>
          <option value="soldout">품절</option>
          <option value="stopped">판매중단</option>
        </select>
      </div>

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
            {filteredOptions.length === 0 ? (
              <tr>
                <td colSpan="6" className="menu-empty-message">
                  검색 조건에 맞는 옵션이 없습니다.
                </td>
              </tr>
            ) : filteredOptions.map((option) => (
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

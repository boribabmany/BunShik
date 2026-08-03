import { useEffect, useState } from "react";
import { filterOptions } from "../../../utils/catalogFilters";

const OPTIONS_PER_PAGE = 3;

export default function OptionListSection({
  options,
  onAdd,
  onEdit,
  onToggleVisibility,
  onImageClick,
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const filteredOptions = filterOptions(options, { query, status });
  const totalPages = Math.ceil(filteredOptions.length / OPTIONS_PER_PAGE);
  const currentOptions = filteredOptions.slice(
    (page - 1) * OPTIONS_PER_PAGE,
    page * OPTIONS_PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [query, status]);

  return (
    <section className="catalog-management-section">
      <div className="edit-filter-group">
        <div className="edit-filter-heading">
          <strong>옵션 검색·필터</strong>
          <span>{filteredOptions.length}/{options.length}개</span>
        </div>
        <div className="edit-filter-controls option-filter-controls">
          <input
            type="search"
            value={query}
            placeholder="옵션명 또는 번호 검색"
            aria-label="메뉴관리 옵션 검색"
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            value={status}
            aria-label="메뉴관리 옵션 판매상태 필터"
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="all">전체 상태</option>
            <option value="active">판매중</option>
            <option value="soldout">품절</option>
            <option value="stopped">판매중단</option>
          </select>
        </div>
      </div>

      <div className="register-button-area">
        <button className="register-btn" onClick={onAdd}>
          + 옵션 등록
        </button>
      </div>
      <div className="edit-table-box">
        <table className="edit-table">
          <thead>
            <tr>
              <th>사진</th>
              <th>옵션명</th>
              <th>영문명</th>
              <th>추가 가격</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {currentOptions.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table-message">
                  검색 조건에 맞는 옵션이 없습니다.
                </td>
              </tr>
            ) : (
              currentOptions.map((option) => (
                <tr
                  key={option.option_id}
                  className={!option.is_visible ? "stopped-row" : ""}
                >
                  <td>
                    {option.option_image ? (
                      <button
                        type="button"
                        className="image-preview-trigger"
                        aria-label={`${option.option_name} 사진 확대`}
                        onClick={() =>
                          onImageClick(option.option_image, option.option_name)
                        }
                      >
                        <img
                          src={option.option_image}
                          alt={option.option_name}
                        />
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{option.option_name}</td>
                  <td>{option.option_name_en || "-"}</td>
                  <td>+{option.option_price.toLocaleString()}원</td>
                  <td>
                    <span
                      className={`status-badge ${
                        !option.is_visible
                          ? "status-stopped"
                          : option.option_is_available
                            ? "status-active"
                            : "status-soldout"
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
                      disabled={!option.is_visible}
                      title={
                        option.is_visible
                          ? "옵션 수정"
                          : "판매재개 후 수정할 수 있습니다."
                      }
                      onClick={() => onEdit("option", option)}
                    >
                      수정
                    </button>
                    <button
                      className={`visibility-toggle-btn ${
                        option.is_visible ? "stop-btn" : "resume-btn"
                      }`}
                      onClick={() => onToggleVisibility(option)}
                    >
                      {option.is_visible ? "판매중단" : "판매재개"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={page === index + 1 ? "active" : ""}
              onClick={() => setPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

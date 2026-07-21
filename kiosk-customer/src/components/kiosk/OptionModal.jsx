import { useState } from "react";
import "../../styles/OptionModal.css";

const MAX_OPTIONS = 2; // 시안에 "최대 2개 선택"으로 명시되어 있어 제한 로직 추가

function OptionModal({ menu, onClose, onAdd }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (option) => {
    const exists = selectedOptions.find(
      (o) => o.option_id === option.option_id,
    );

    if (exists) {
      // 이미 선택된 옵션이면 해제
      setSelectedOptions(
        selectedOptions.filter((o) => o.option_id !== option.option_id),
      );
    } else {
      // 새로 선택하려는데 이미 2개 선택된 상태면 막음
      if (selectedOptions.length >= MAX_OPTIONS) return;
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const totalPrice =
    menu.price + selectedOptions.reduce((sum, o) => sum + o.option_price, 0);

  const handleAdd = () => {
    onAdd({
      menu_id: menu.menu_id,
      menu_name: menu.menu_name,
      image_url: menu.image_url,
      base_price: menu.price,
      quantity: 1,
      options: selectedOptions,
    });
    onClose();
  };

  return (
    // 화면 전체를 덮는 반투명 배경 (팝업 바깥 영역)
    <div className="option-modal-backdrop" onClick={onClose}>
      {/* 팝업 카드 본체 - 클릭 이벤트가 배경까지 전파돼서 닫히지 않도록 stopPropagation */}
      <div className="option-modal" onClick={(e) => e.stopPropagation()}>
        {/* ---------- 상단: 메뉴 상세 (사진+이름+설명+가격) ---------- */}
        <div className="option-modal-detail">
          <img
            src={menu.image_url}
            alt={menu.menu_name}
            className="option-modal-image"
          />
          <p className="option-modal-name">{menu.menu_name}</p>
          <p className="option-modal-description">{menu.description}</p>
          <p className="option-modal-price">{menu.price.toLocaleString()}원</p>
        </div>

        {/* 상세와 토핑 영역을 나누는 구분선 */}
        <div className="option-modal-divider" />

        {/* ---------- 중단: 회색 배경 영역 (토핑 추가 라벨 + 옵션 카드들) ---------- */}
        <div className="option-modal-body">
          <div className="option-modal-topping-header">
            <span className="option-modal-topping-label">토핑 추가</span>
            <span className="option-modal-topping-badge">
              최대 {MAX_OPTIONS}개 선택
            </span>
          </div>

          <div className="option-modal-list">
            {menu.options.map((option) => {
              const isSelected = selectedOptions.some(
                (o) => o.option_id === option.option_id,
              );

              return (
                <div key={option.option_id} className="option-card">
                  <img
                    src={option.option_image}
                    alt={option.option_name}
                    className="option-card-image"
                  />
                  <p className="option-card-name">{option.option_name}</p>
                  <p className="option-card-price">
                    {option.option_price.toLocaleString()}원
                  </p>

                  <button
                    type="button"
                    onClick={() => toggleOption(option)}
                    className={`option-card-toggle-btn ${isSelected ? "is-selected" : ""}`}
                  >
                    {isSelected ? "✓" : "+"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------- 하단: 연두색 배경 + 흰색 메뉴담기 버튼 ---------- */}
        <div className="option-modal-footer">
          <button
            type="button"
            onClick={handleAdd}
            className="option-modal-submit-button"
          >
            <span className="option-modal-submit-label">메뉴 담기</span>
            <span className="option-modal-submit-price">
              {totalPrice.toLocaleString()}원
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default OptionModal;

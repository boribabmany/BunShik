import { useState } from "react";
import {
  translations,
  getLocalizedName,
  formatPrice,
  getGroupLabel,
} from "../../i18n/translations";
import "../../styles/OptionModal.css";

const MAX_OPTIONS = 2;

function OptionModal({ menu, onClose, onAdd, language }) {
  const t = translations[language].option;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selections, setSelections] = useState({});

  const menuName = getLocalizedName(
    language,
    menu.menu_name,
    menu.menu_name_en,
  );
  const menuDescription = getLocalizedName(
    language,
    menu.description,
    menu.description_en,
  );

  const groups = [];
  const groupMap = {};
  (menu.set_components ?? []).forEach((component) => {
    const key = component.select_group;
    if (!groupMap[key]) {
      groupMap[key] = {
        name: key,
        maxSelect: component.group_max_select,
        items: [],
      };
      groups.push(groupMap[key]);
    }
    groupMap[key].items.push(component);
  });

  const toggleGroupComponent = (groupName, component) => {
    if (!component.is_available) return;

    setSelections((prev) => {
      const current = prev[groupName];
      if (current?.component_menu_id === component.component_menu_id) {
        const next = { ...prev };
        delete next[groupName];
        return next;
      }
      return { ...prev, [groupName]: component };
    });
  };

  const toggleOption = (option) => {
    if (!option.option_is_available) return;

    const exists = selectedOptions.find(
      (o) => o.option_id === option.option_id,
    );
    if (exists) {
      setSelectedOptions(
        selectedOptions.filter((o) => o.option_id !== option.option_id),
      );
    } else {
      if (selectedOptions.length >= MAX_OPTIONS) return;
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const selectedComponents = Object.values(selections);
  const allGroupsSelected = groups.every((g) => selections[g.name]);

  const totalPrice =
    menu.price +
    selectedOptions.reduce((sum, o) => sum + o.option_price, 0) +
    selectedComponents.reduce((sum, c) => sum + c.extra_price, 0);

  const handleAdd = () => {
    if (!allGroupsSelected) return;

    onAdd({
      menu_id: menu.menu_id,
      menu_name: menu.menu_name,
      menu_name_en: menu.menu_name_en,
      image_url: menu.image_url,
      base_price: menu.price,
      quantity: 1,
      options: selectedOptions,
      components: selectedComponents,
    });
    onClose();
  };

  return (
    <div className="option-modal-backdrop" onClick={onClose}>
      <div className="option-modal" onClick={(e) => e.stopPropagation()}>
        {/* 상단 메뉴 정보 — 고정 */}
        <div className="option-modal-detail">
          <img
            src={menu.image_url}
            alt={menuName}
            className="option-modal-image"
          />
          <p className="option-modal-name">{menuName}</p>
          <p className="option-modal-description">{menuDescription}</p>
          <p className="option-modal-price">
            {formatPrice(language, menu.price)}
          </p>
        </div>

        <div className="option-modal-divider" />

        {/* 회색 배경 스크롤 영역 — 구분선 바로 아래부터 시작, 맛 선택 + 토핑 전부 포함 */}
        <div className="option-modal-scroll-area">
          {groups.map((group, idx) => {
            const isPillGroup = group.items.every(
              (c) => !c.component_image_url,
            );

            return (
              <div key={group.name} className="option-modal-group">
                {idx > 0 && <div className="option-modal-group-divider" />}

                <p className="option-modal-group-eyebrow">{t.optionSelect}</p>

                <div className="option-modal-group-header">
                  <span className="option-modal-group-label">
                    {getGroupLabel(language, group.name)}
                  </span>
                  <span className="option-modal-group-badge">
                    {t.maxSelect(group.maxSelect)}
                  </span>
                </div>

                {isPillGroup ? (
                  <div className="option-modal-group-list option-modal-group-list--pill">
                    {group.items.map((component) => {
                      const isSelected =
                        selections[group.name]?.component_menu_id ===
                        component.component_menu_id;
                      const isSoldOut = !component.is_available;
                      const componentName = getLocalizedName(
                        language,
                        component.component_menu_name,
                        component.component_menu_name_en,
                      );

                      return (
                        <button
                          key={component.component_menu_id}
                          type="button"
                          onClick={() =>
                            toggleGroupComponent(group.name, component)
                          }
                          disabled={isSoldOut}
                          className={`option-group-pill ${isSelected ? "is-selected" : ""}`}
                        >
                          {componentName}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="option-modal-group-list">
                    {group.items.map((component) => {
                      const isSelected =
                        selections[group.name]?.component_menu_id ===
                        component.component_menu_id;
                      const isSoldOut = !component.is_available;
                      const componentName = getLocalizedName(
                        language,
                        component.component_menu_name,
                        component.component_menu_name_en,
                      );

                      return (
                        <div
                          key={component.component_menu_id}
                          className="option-group-card"
                        >
                          <div className="option-group-image-wrap">
                            <img
                              src={component.component_image_url}
                              alt={componentName}
                              className="option-group-image"
                            />
                            {isSoldOut && (
                              <div className="option-group-soldout-overlay">
                                <span>{t.soldOut}</span>
                              </div>
                            )}
                          </div>
                          <p className="option-group-name">{componentName}</p>
                          <p className="option-group-price">
                            {component.extra_price > 0
                              ? formatPrice(language, component.extra_price)
                              : formatPrice(language, 0)}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              toggleGroupComponent(group.name, component)
                            }
                            disabled={isSoldOut}
                            className={`option-group-toggle-btn ${isSelected ? "is-selected" : ""}`}
                          >
                            {isSelected ? "✓" : "+"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {groups.length > 0 && menu.options?.length > 0 && (
            <div className="option-modal-group-divider" />
          )}

          {menu.options?.length > 0 && (
            <div className="option-modal-topping-section">
              <div className="option-modal-topping-header">
                <span className="option-modal-topping-label">
                  {t.toppingAdd}
                </span>
                <span className="option-modal-topping-badge">
                  {t.maxSelect(MAX_OPTIONS)}
                </span>
              </div>

              <div className="option-modal-list">
                {menu.options.map((option) => {
                  const isSelected = selectedOptions.some(
                    (o) => o.option_id === option.option_id,
                  );
                  const isOptionSoldOut = !option.option_is_available;
                  const optionName = getLocalizedName(
                    language,
                    option.option_name,
                    option.option_name_en,
                  );

                  return (
                    <div key={option.option_id} className="option-card">
                      <div className="option-card-image-wrap">
                        <img
                          src={option.option_image}
                          alt={optionName}
                          className="option-card-image"
                        />
                        {isOptionSoldOut && (
                          <div className="option-card-soldout-overlay">
                            <span>{t.soldOut}</span>
                          </div>
                        )}
                      </div>

                      <p className="option-card-name">{optionName}</p>
                      <p className="option-card-price">
                        {formatPrice(language, option.option_price)}
                      </p>

                      <button
                        type="button"
                        onClick={() => toggleOption(option)}
                        disabled={isOptionSoldOut}
                        className={`option-card-toggle-btn ${isSelected ? "is-selected" : ""}`}
                      >
                        {isSelected ? "✓" : "+"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 하단 담기 버튼 — 고정 */}
        <div className="option-modal-footer">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!allGroupsSelected}
            className="option-modal-submit-button"
          >
            <span className="option-modal-submit-label">{t.addToCart}</span>
            <span className="option-modal-submit-price">
              {formatPrice(language, totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default OptionModal;

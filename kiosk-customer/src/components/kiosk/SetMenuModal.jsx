import { useState } from "react";
import {
  translations,
  getLocalizedName,
  formatPrice,
  getGroupLabel,
} from "../../i18n/translations";
import "../../styles/SetMenuModal.css";

function SetMenuModal({ menu, onClose, onAdd, language }) {
  const t = translations[language].option;
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
  menu.set_components.forEach((component) => {
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

  const toggleComponent = (groupName, component) => {
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

  const selectedList = Object.values(selections);
  const totalPrice =
    menu.price + selectedList.reduce((sum, c) => sum + c.extra_price, 0);
  const allGroupsSelected = groups.every((g) => selections[g.name]);

  const handleAdd = () => {
    if (!allGroupsSelected) return;

    onAdd({
      menu_id: menu.menu_id,
      menu_name: menu.menu_name,
      menu_name_en: menu.menu_name_en,
      image_url: menu.image_url,
      base_price: menu.price,
      quantity: 1,
      options: [],
      components: selectedList,
    });
    onClose();
  };

  return (
    <div className="set-modal-backdrop" onClick={onClose}>
      <div className="set-modal" onClick={(e) => e.stopPropagation()}>
        <div className="set-modal-detail">
          <img
            src={menu.image_url}
            alt={menuName}
            className="set-modal-image"
          />
          <p className="set-modal-name">{menuName}</p>
          <p className="set-modal-description">{menuDescription}</p>
          <p className="set-modal-price">{formatPrice(language, menu.price)}</p>
        </div>

        <div className="set-modal-divider" />

        <div className="set-modal-scroll-area">
          {groups.map((group, idx) => {
            // 이미지가 없는 그룹(맛/구성 선택 등) → 텍스트 pill 버튼
            // 이미지가 있는 그룹(사이드/음료 등) → 기존 카드 스타일
            const isPillGroup = group.items.every(
              (c) => !c.component_image_url,
            );

            return (
              <div key={group.name} className="set-modal-group">
                {idx > 0 && <div className="set-modal-group-divider" />}

                <p className="set-modal-group-eyebrow">{t.optionSelect}</p>

                <div className="set-modal-group-header">
                  <span className="set-modal-group-label">
                    {getGroupLabel(language, group.name)}
                  </span>
                  <span className="set-modal-group-badge">
                    {t.maxSelect(group.maxSelect)}
                  </span>
                </div>

                {isPillGroup ? (
                  <div className="set-modal-group-list set-modal-group-list--pill">
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
                          onClick={() => toggleComponent(group.name, component)}
                          disabled={isSoldOut}
                          className={`set-option-pill ${isSelected ? "is-selected" : ""}`}
                        >
                          {componentName}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="set-modal-group-list">
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
                          className="set-option-card"
                        >
                          <div className="set-option-image-wrap">
                            <img
                              src={component.component_image_url}
                              alt={componentName}
                              className="set-option-image"
                            />
                            {isSoldOut && (
                              <div className="set-option-soldout-overlay">
                                <span>{t.soldOut}</span>
                              </div>
                            )}
                          </div>
                          <p className="set-option-name">{componentName}</p>
                          <p className="set-option-price">
                            {component.extra_price > 0
                              ? `${formatPrice(language, component.extra_price)}`
                              : formatPrice(language, 0)}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              toggleComponent(group.name, component)
                            }
                            disabled={isSoldOut}
                            className={`set-option-toggle-btn ${isSelected ? "is-selected" : ""}`}
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
        </div>

        <div className="set-modal-footer">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!allGroupsSelected}
            className="set-modal-submit-button"
          >
            <span className="set-modal-submit-label">{t.addToCart}</span>
            <span className="set-modal-submit-price">
              {formatPrice(language, totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetMenuModal;

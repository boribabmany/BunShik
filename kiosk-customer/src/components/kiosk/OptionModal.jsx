import { useState } from "react";
import {
  translations,
  getLocalizedName,
  formatPrice,
} from "../../i18n/translations";
import "../../styles/OptionModal.css";

const MAX_OPTIONS = 2;

function OptionModal({ menu, onClose, onAdd, language }) {
  const t = translations[language].option;
  const [selectedOptions, setSelectedOptions] = useState([]);

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

  const toggleOption = (option) => {
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

  const totalPrice =
    menu.price + selectedOptions.reduce((sum, o) => sum + o.option_price, 0);

  const handleAdd = () => {
    onAdd({
      menu_id: menu.menu_id,
      menu_name: menu.menu_name,
      menu_name_en: menu.menu_name_en,
      image_url: menu.image_url,
      base_price: menu.price,
      quantity: 1,
      options: selectedOptions,
    });
    onClose();
  };

  return (
    <div className="option-modal-backdrop" onClick={onClose}>
      <div className="option-modal" onClick={(e) => e.stopPropagation()}>
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

        <div className="option-modal-body">
          <div className="option-modal-topping-header">
            <span className="option-modal-topping-label">{t.toppingAdd}</span>
            <span className="option-modal-topping-badge">
              {t.maxSelect(MAX_OPTIONS)}
            </span>
          </div>

          <div className="option-modal-list">
            {menu.options.map((option) => {
              const isSelected = selectedOptions.some(
                (o) => o.option_id === option.option_id,
              );
              const optionName = getLocalizedName(
                language,
                option.option_name,
                option.option_name_en,
              );

              return (
                <div key={option.option_id} className="option-card">
                  <img
                    src={option.option_image}
                    alt={optionName}
                    className="option-card-image"
                  />
                  <p className="option-card-name">{optionName}</p>
                  <p className="option-card-price">
                    {formatPrice(language, option.option_price)}
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

        <div className="option-modal-footer">
          <button
            type="button"
            onClick={handleAdd}
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

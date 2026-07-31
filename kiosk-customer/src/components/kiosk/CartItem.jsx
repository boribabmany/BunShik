import { useEffect, useLayoutEffect, useRef, useState } from "react";
import trashIcon from "../../images/trash.png";
import {
  translations,
  getLocalizedName,
  formatPrice,
} from "../../i18n/translations";
import { fitFontSizeByDOM } from "../../utils/fitFontSize";

function CartItem({ item, onIncrease, onDecrease, onRemove, language }) {
  const t = translations[language].cart;
  const hasOptions = item.options.length > 0;
  const hasComponents = (item.components || []).length > 0;
  const itemName = getLocalizedName(
    language,
    item.menu_name,
    item.menu_name_en,
  );

  const nameRef = useRef(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [fontSize, setFontSize] = useState(46);

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  useLayoutEffect(() => {
    if (language !== "en") {
      setFontSize(44);
      return;
    }
    if (!nameRef.current) return;

    const availableWidth = nameRef.current.getBoundingClientRect().width - 2;

    const size = fitFontSizeByDOM(itemName, availableWidth, {
      max: 46,
      min: 36,
      fontWeight: 500,
      fontFamily: "Pretendard, sans-serif",
    });
    setFontSize(size);
  }, [itemName, language, fontsReady]);

  const optionTotal = item.options.reduce((sum, o) => sum + o.option_price, 0);
  const componentTotal = (item.components || []).reduce(
    (sum, c) => sum + c.extra_price,
    0,
  );
  const itemTotal =
    (item.base_price + optionTotal + componentTotal) * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-toprow">
        <img src={item.image_url} alt={itemName} className="cart-item-image" />

        <p
          ref={nameRef}
          className={`cart-item-name${
            language === "en" ? " cart-item-name--en" : ""
          }`}
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: language === "en" ? 500 : undefined,
          }}
        >
          {itemName}
        </p>

        <div className="cart-item-qty-box">
          <button
            type="button"
            onClick={onDecrease}
            className="cart-item-qty-btn"
          >
            -
          </button>
          <span className="cart-item-qty-value">{item.quantity}</span>
          <button
            type="button"
            onClick={onIncrease}
            className="cart-item-qty-btn"
          >
            +
          </button>
        </div>

        <p className="cart-item-total">{formatPrice(language, itemTotal)}</p>

        <button type="button" onClick={onRemove} className="cart-item-delete">
          <img
            src={trashIcon}
            alt={t.deleteAlt}
            className="cart-item-delete-icon"
          />
        </button>
      </div>

      {hasOptions &&
        item.options.map((option) => (
          <div key={option.option_id} className="cart-item-option-row">
            <span>
              +
              {getLocalizedName(
                language,
                option.option_name,
                option.option_name_en,
              )}
            </span>
            <span>+{formatPrice(language, option.option_price)}</span>
          </div>
        ))}

      {hasComponents &&
        item.components.map((component) => (
          <div
            key={component.component_menu_id}
            className="cart-item-option-row"
          >
            <span>
              {getLocalizedName(
                language,
                component.component_menu_name,
                component.component_menu_name_en,
              )}
            </span>
            <span>
              {component.extra_price > 0
                ? `+${formatPrice(language, component.extra_price)}`
                : formatPrice(language, 0)}
            </span>
          </div>
        ))}
    </div>
  );
}

export default CartItem;

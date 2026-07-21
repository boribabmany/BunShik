import trashIcon from "../../images/trash.png";
import {
  translations,
  getLocalizedName,
  formatPrice,
} from "../../i18n/translations";

function CartItem({ item, onIncrease, onDecrease, onRemove, language }) {
  const t = translations[language].cart;
  const hasOptions = item.options.length > 0;
  const itemName = getLocalizedName(
    language,
    item.menu_name,
    item.menu_name_en,
  );

  const optionTotal = item.options.reduce((sum, o) => sum + o.option_price, 0);
  const itemTotal = (item.base_price + optionTotal) * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-toprow">
        <img src={item.image_url} alt={itemName} className="cart-item-image" />

        <p className="cart-item-name">{itemName}</p>

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
    </div>
  );
}

export default CartItem;

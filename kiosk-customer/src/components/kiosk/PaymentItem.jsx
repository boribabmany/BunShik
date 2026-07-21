import {
  translations,
  getLocalizedName,
  formatPrice,
} from "../../i18n/translations";

function PaymentItem({ item, language }) {
  const t = translations[language].payment;
  const hasOptions = item.options.length > 0;
  const itemName = getLocalizedName(
    language,
    item.menu_name,
    item.menu_name_en,
  );
  const optionTotal = item.options.reduce((sum, o) => sum + o.option_price, 0);
  const itemTotal = (item.base_price + optionTotal) * item.quantity;

  return (
    <div className="payment-item">
      <div className="payment-item-toprow">
        <img
          src={item.image_url}
          alt={itemName}
          className="payment-item-image"
        />
        <p className="payment-item-name">{itemName}</p>
        <div className="payment-item-qty-box">{t.qty(item.quantity)}</div>
        <p className="payment-item-price">{formatPrice(language, itemTotal)}</p>
      </div>

      {hasOptions &&
        item.options.map((option) => (
          <div key={option.option_id} className="payment-item-option-row">
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

export default PaymentItem;

import cartIcon from "../../images/carticon.png";
import { translations, formatPrice } from "../../i18n/translations";

function CartBar({ count, total, onCheckClick, disabled, language }) {
  const t = translations[language].menu;

  const handleBoxClick = () => {
    if (disabled) return;
    onCheckClick();
  };

  return (
    <div className="menu-cartbar-footer">
      <div
        className="menu-cartbar-box"
        onClick={handleBoxClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
      >
        <img src={cartIcon} alt="" className="menu-cartbar-icon" />
        <p className="menu-cartbar-label">{t.cartLabel}</p>
        <p className="menu-cartbar-count">{t.cartCount(count)}</p>
        <p className="menu-cartbar-total">{formatPrice(language, total)}</p>
      </div>

      <button
        type="button"
        onClick={onCheckClick}
        disabled={disabled}
        className="menu-cartbar-confirm"
      >
        {t.cartConfirm}
      </button>
    </div>
  );
}

export default CartBar;

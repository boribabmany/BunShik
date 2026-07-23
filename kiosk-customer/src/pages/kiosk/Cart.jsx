import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import useLanguageStore from "../../store/useLanguageStore";
import { translations, formatPrice } from "../../i18n/translations";
import CartItem from "../../components/kiosk/CartItem";
import logo from "../../images/bunshiklogo.png";
import "../../styles/common.css";
import "../../styles/Cart.css";

function Cart() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const language = useLanguageStore((state) => state.language);
  const t = translations[language].cart;

  const isEmpty = items.length === 0;
  const totalPrice = getTotalPrice();

  return (
    <div className="cart-screen">
      <button
        type="button"
        className="menu-back-button"
        onClick={() => navigate(-1)}
      >
        <span className="menu-back-icon" />
        <span className="menu-back-text">
          {translations[language].common.back}
        </span>
      </button>

      <img src={logo} alt="분식집 로고" className="menu-logo" />

      <div className="cart-header">
        <span className="cart-header-menu">{t.headerMenu}</span>
        <span className="cart-header-qty">{t.headerQty}</span>
        <span className="cart-header-price">{t.headerPrice}</span>
        <span className="cart-header-delete">{t.headerDelete}</span>
      </div>

      <div className="cart-divider-top" />

      <div className="cart-list-wrapper">
        {isEmpty ? (
          <p className="cart-empty-text">{t.empty}</p>
        ) : (
          <div className="cart-list">
            {items.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                onIncrease={() => increaseQuantity(index)}
                onDecrease={() => decreaseQuantity(index)}
                onRemove={() => removeItem(index)}
                language={language}
              />
            ))}
          </div>
        )}
      </div>

      <div className="cart-divider-bottom" />

      <div className="cart-total-row">
        <p className="cart-total-label">{t.totalLabel}</p>
        <p className="cart-total-price">{formatPrice(language, totalPrice)}</p>
      </div>

      <button
        type="button"
        className="cart-more-button"
        onClick={() => navigate("/menu")}
      >
        {t.moreMenu}
      </button>

      <button
        type="button"
        className="cart-confirm-button"
        onClick={() => navigate("/payment")}
        disabled={isEmpty}
      >
        {t.confirm}
      </button>
    </div>
  );
}

export default Cart;

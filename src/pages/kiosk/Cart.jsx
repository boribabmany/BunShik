import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
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
        <span className="menu-back-text">뒤로가기</span>
      </button>

      <img src={logo} alt="분식집 로고" className="menu-logo" />

      <div className="cart-header">
        <span className="cart-header-menu">메뉴</span>
        <span className="cart-header-qty">수량</span>
        <span className="cart-header-price">금액</span>
        <span className="cart-header-delete">삭제</span>
      </div>

      <div className="cart-divider-top" />

      {/* 위/아래 구분선 사이에서만 스크롤 */}
      <div className="cart-list-wrapper">
        {isEmpty ? (
          <p className="cart-empty-text">장바구니가 비어있습니다</p>
        ) : (
          <div className="cart-list">
            {items.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                onIncrease={() => increaseQuantity(index)}
                onDecrease={() => decreaseQuantity(index)}
                onRemove={() => removeItem(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="cart-divider-bottom" />

      <div className="cart-total-row">
        <p className="cart-total-label">총 금액</p>
        <p className="cart-total-price">{totalPrice.toLocaleString()}원</p>
      </div>

      <button
        type="button"
        className="cart-more-button"
        onClick={() => navigate("/menu")}
      >
        메뉴 더 담기
      </button>

      <button
        type="button"
        className="cart-confirm-button"
        onClick={() => navigate("/payment")}
        disabled={isEmpty}
      >
        주문 확인
      </button>
    </div>
  );
}

export default Cart;

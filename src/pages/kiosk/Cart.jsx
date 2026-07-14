import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import CartItem from "../../components/kiosk/CartItem";

function Cart() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const isEmpty = items.length === 0;

  const totalPrice = items.reduce((sum, item) => {
    const optionTotal = item.options.reduce((s, o) => s + o.option_price, 0);
    return sum + (item.base_price + optionTotal) * item.quantity;
  }, 0);

  return (
    <div>
      <div>
        <span>메뉴</span>
        <span>수량</span>
        <span>금액</span>
        <span>삭제</span>
      </div>

      {isEmpty ? (
        <p>장바구니가 비어있습니다</p>
      ) : (
        items.map((item, index) => (
          <CartItem
            key={index}
            item={item}
            onIncrease={() => increaseQuantity(index)}
            onDecrease={() => decreaseQuantity(index)}
            onRemove={() => removeItem(index)}
          />
        ))
      )}

      <div>
        <span>총 금액</span>
        <span>{totalPrice.toLocaleString()}원</span>
      </div>

      <button type="button" onClick={() => navigate("/menu")}>
        메뉴 더 담기
      </button>

      <button
        type="button"
        onClick={() => navigate("/payment")}
        disabled={isEmpty}
      >
        주문 확인
      </button>
    </div>
  );
}

export default Cart;

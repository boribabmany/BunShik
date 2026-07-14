function CartBar({ count, total, onCheckClick, disabled }) {
  return (
    <div>
      <span>장바구니 {count}개</span>
      <span>{total.toLocaleString()}원</span>
      <button type="button" onClick={onCheckClick} disabled={disabled}>
        주문 확인
      </button>
    </div>
  );
}

export default CartBar;

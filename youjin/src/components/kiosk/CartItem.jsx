function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const optionTotal = item.options.reduce((sum, o) => sum + o.option_price, 0);
  const itemTotal = (item.base_price + optionTotal) * item.quantity;

  return (
    <div>
      <img src={item.image_url} alt={item.menu_name} />

      <p>{item.menu_name}</p>

      <div>
        <button type="button" onClick={onDecrease}>
          -
        </button>
        <span>{item.quantity}</span>
        <button type="button" onClick={onIncrease}>
          +
        </button>
      </div>

      <p>{itemTotal.toLocaleString()}원</p>

      <button type="button" onClick={onRemove}>
        삭제
      </button>
    </div>
  );
}

export default CartItem;

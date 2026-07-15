function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const hasOptions = item.options.length > 0; // 옵션 있는 메뉴인지 확인

  const optionTotal = item.options.reduce((sum, o) => sum + o.option_price, 0);
  const itemTotal = (item.base_price + optionTotal) * item.quantity;

  return (
    <div>
      <img src={item.image_url} alt={item.menu_name} />

      <div>
        <p>{item.menu_name}</p>

        {/* 옵션이 있을 때만 렌더링 */}
        {hasOptions && (
          <div>
            {item.options.map((option) => (
              <div key={option.option_id}>
                <span>+{option.option_name}</span>
                <span>+{option.option_price.toLocaleString()}원</span>
              </div>
            ))}
          </div>
        )}
      </div>

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

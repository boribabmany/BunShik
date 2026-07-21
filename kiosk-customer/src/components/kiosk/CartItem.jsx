import trashIcon from "../../images/trash.png";

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const hasOptions = item.options.length > 0;

  const optionTotal = item.options.reduce((sum, o) => sum + o.option_price, 0);
  const itemTotal = (item.base_price + optionTotal) * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-toprow">
        <img
          src={item.image_url}
          alt={item.menu_name}
          className="cart-item-image"
        />

        <p className="cart-item-name">{item.menu_name}</p>

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

        <p className="cart-item-total">{itemTotal.toLocaleString()}원</p>

        <button type="button" onClick={onRemove} className="cart-item-delete">
          <img src={trashIcon} alt="삭제" className="cart-item-delete-icon" />
        </button>
      </div>

      {hasOptions &&
        item.options.map((option) => (
          <div key={option.option_id} className="cart-item-option-row">
            <span>+{option.option_name}</span>
            <span>+{option.option_price.toLocaleString()}원</span>
          </div>
        ))}
    </div>
  );
}

export default CartItem;

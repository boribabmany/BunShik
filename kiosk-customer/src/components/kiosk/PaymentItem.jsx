function PaymentItem({ item }) {
  const hasOptions = item.options.length > 0;
  const optionTotal = item.options.reduce((sum, o) => sum + o.option_price, 0);
  const itemTotal = (item.base_price + optionTotal) * item.quantity;

  return (
    <div className="payment-item">
      <div className="payment-item-toprow">
        <img
          src={item.image_url}
          alt={item.menu_name}
          className="payment-item-image"
        />
        <p className="payment-item-name">{item.menu_name}</p>
        <div className="payment-item-qty-box">{item.quantity}개</div>
        <p className="payment-item-price">{itemTotal.toLocaleString()}원</p>
      </div>

      {hasOptions &&
        item.options.map((option) => (
          <div key={option.option_id} className="payment-item-option-row">
            <span>+{option.option_name}</span>
            <span>+{option.option_price.toLocaleString()}원</span>
          </div>
        ))}
    </div>
  );
}

export default PaymentItem;

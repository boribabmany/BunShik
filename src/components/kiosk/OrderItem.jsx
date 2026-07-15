function OrderItem({ item }) {
  const hasOptions = item.options.length > 0;

  const optionTotal = item.options.reduce((sum, o) => sum + o.option_price, 0);
  const itemTotal = (item.base_price + optionTotal) * item.quantity;

  return (
    <div>
      <img src={item.image_url} alt={item.menu_name} />

      <div>
        <p>{item.menu_name}</p>

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

      <span>{item.quantity}개</span>

      <span>{itemTotal.toLocaleString()}원</span>
    </div>
  );
}

export default OrderItem;

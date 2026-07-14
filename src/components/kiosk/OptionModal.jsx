import { useState } from "react";

function OptionModal({ menu, onClose, onAdd }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (option) => {
    const exists = selectedOptions.find(
      (o) => o.option_id === option.option_id,
    );
    if (exists) {
      setSelectedOptions(
        selectedOptions.filter((o) => o.option_id !== option.option_id),
      );
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const totalPrice =
    menu.price + selectedOptions.reduce((sum, o) => sum + o.option_price, 0);

  const handleAdd = () => {
    onAdd({
      menu_id: menu.menu_id,
      menu_name: menu.menu_name,
      image_url: menu.image_url,
      base_price: menu.price,
      quantity: 1,
      options: selectedOptions,
    });
    onClose();
  };

  return (
    <div>
      <div>
        <img src={menu.image_url} alt={menu.menu_name} />
        <h2>{menu.menu_name}</h2>
        <p>{menu.description}</p>
        <p>{menu.price.toLocaleString()}원</p>
      </div>

      <div>
        <p>토핑 추가 (최대 2개 선택)</p>
        {menu.options.map((option) => {
          const isSelected = selectedOptions.some(
            (o) => o.option_id === option.option_id,
          );
          return (
            <button
              key={option.option_id}
              type="button"
              onClick={() => toggleOption(option)}
            >
              <img src={option.option_image} alt={option.option_name} />
              {option.option_name} {isSelected ? "✓" : "+"}
              <br />
              {option.option_price.toLocaleString()}원
            </button>
          );
        })}
      </div>

      <button type="button" onClick={handleAdd}>
        메뉴 담기 ({totalPrice.toLocaleString()}원)
      </button>
      <button type="button" onClick={onClose}>
        닫기
      </button>
    </div>
  );
}

export default OptionModal;

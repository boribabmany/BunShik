function MenuCard({ menu, onClick }) {
  return (
    <div>
      <img src={menu.image_url} alt={menu.menu_name} />
      <p>{menu.menu_name}</p>
      <p>{menu.price.toLocaleString()}원</p>
      <button type="button" onClick={onClick}>
        +
      </button>
    </div>
  );
}

export default MenuCard;

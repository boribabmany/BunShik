function MenuCard({ menu, onClick }) {
  const isSoldOut = !menu.is_available;

  return (
    <div className="menu-card">
      <div className="menu-card-image-wrap">
        <img src={menu.image_url} alt={menu.menu_name} />

        {isSoldOut && (
          <div className="menu-card-soldout-overlay">
            <span>품절</span>
          </div>
        )}
      </div>

      <p className="menu-card-name">{menu.menu_name}</p>
      <p className="menu-card-price">{menu.price.toLocaleString()}원</p>

      <button
        type="button"
        onClick={onClick}
        disabled={isSoldOut}
        className="menu-card-add-btn"
      >
        <span className="menu-card-add-icon" />
      </button>
    </div>
  );
}

export default MenuCard;

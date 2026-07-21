import {
  translations,
  getLocalizedName,
  formatPrice,
} from "../../i18n/translations";

function MenuCard({ menu, onClick, language }) {
  const t = translations[language].menu;
  const isSoldOut = !menu.is_available;
  const displayName = getLocalizedName(
    language,
    menu.menu_name,
    menu.menu_name_en,
  );

  return (
    <div className="menu-card">
      <div className="menu-card-image-wrap">
        <img src={menu.image_url} alt={displayName} />

        {isSoldOut && (
          <div className="menu-card-soldout-overlay">
            <span>{t.soldOut}</span>
          </div>
        )}
      </div>

      <p className="menu-card-name">{displayName}</p>
      <p className="menu-card-price">{formatPrice(language, menu.price)}</p>

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

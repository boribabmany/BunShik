import { useRef } from "react";
import backIcon from "../../images/backicon.png";
import { translations } from "../../i18n/translations";

const categories = ["전체", "떡볶이", "라면", "김밥", "사이드", "음료"];

function CategoryTabs({ selected, onSelect, language }) {
  const scrollRef = useRef(null);
  const t = translations[language].menu;
  const categoryLabels = t.categories;

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const didDrag = useRef(false);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    didDrag.current = false;
    startX.current = e.pageX;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.pageX - startX.current;
    if (Math.abs(delta) > 5) didDrag.current = true;
    scrollRef.current.scrollLeft = scrollLeftStart.current - delta;
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  const handleClickCapture = (e) => {
    if (didDrag.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const handlePrevClick = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const handleNextClick = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="menu-category-tabs-wrap">
      <button
        type="button"
        className="menu-category-nav-btn"
        onClick={handlePrevClick}
        aria-label={t.prevCategory}
      >
        <img src={backIcon} alt="" className="menu-category-prev-icon" />
      </button>

      <div
        ref={scrollRef}
        className="menu-category-tabs"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onClickCapture={handleClickCapture}
      >
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            data-category={category}
            className={`menu-category-btn ${selected === category ? "active" : ""}`}
            onClick={() => onSelect(category)}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="menu-category-nav-btn"
        onClick={handleNextClick}
        aria-label={t.nextCategory}
      >
        <img src={backIcon} alt="" className="menu-category-next-icon" />
      </button>
    </div>
  );
}

export default CategoryTabs;

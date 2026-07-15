const categories = ["전체", "떡볶이", "라면", "김밥", "음료"];

function CategoryTabs({ selected, onSelect }) {
  return (
    <div className="menu-category-tabs">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          data-category={category}
          className={`menu-category-btn ${selected === category ? "active" : ""}`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;

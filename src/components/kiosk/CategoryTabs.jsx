const categories = ["전체", "떡볶이", "라면", "김밥", "음료"];

function CategoryTabs({ selected, onSelect }) {
  return (
    <div>
      {categories.map((category) => (
        <button key={category} type="button" onClick={() => onSelect(category)}>
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;

import { useRef } from "react";

const categories = ["전체", "떡볶이", "라면", "김밥", "사이드", "음료"];

function CategoryTabs({ selected, onSelect }) {
  const scrollRef = useRef(null);

  // 드래그 상태를 저장 (리렌더링 필요 없는 값들이라 useRef로 관리)
  const isDragging = useRef(false);
  const startX = useRef(0); // 드래그 시작 시점의 마우스 x좌표
  const scrollLeftStart = useRef(0); // 드래그 시작 시점의 스크롤 위치
  const didDrag = useRef(false); // 드래그가 실제로 일어났는지 (클릭과 구분하기 위함)

  const handleMouseDown = (e) => {
    isDragging.current = true;
    didDrag.current = false;
    startX.current = e.pageX;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const delta = e.pageX - startX.current;

    // 일정 거리 이상 움직였을 때만 "드래그"로 인정 (미세한 떨림은 클릭으로 처리)
    if (Math.abs(delta) > 5) {
      didDrag.current = true;
    }

    scrollRef.current.scrollLeft = scrollLeftStart.current - delta;
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  // 드래그 직후 발생하는 클릭 이벤트를 막아서, 슬라이드했는데 버튼이 눌리는 걸 방지
  const handleClickCapture = (e) => {
    if (didDrag.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
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
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;

import { useRef } from "react";

// 마우스 드래그로 좌우 슬라이드 가능한 컨테이너 (터치는 브라우저 기본 스크롤로 동작)
function DragScrollRow({ className, children, ...rest }) {
  const scrollRef = useRef(null);
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

  // 드래그 중이었다면 뒤이은 클릭(카드 선택)이 실행되지 않도록 차단
  const handleClickCapture = (e) => {
    if (didDrag.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div
      ref={scrollRef}
      className={className}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onClickCapture={handleClickCapture}
      {...rest}
    >
      {children}
    </div>
  );
}

export default DragScrollRow;

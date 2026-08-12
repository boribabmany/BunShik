import { render, screen, fireEvent } from "@testing-library/react";
import DragScrollRow from "./DragScrollRow";

// jsdom의 MouseEvent는 pageX/pageY를 표준대로 지원하지 않아(clientX로부터 계산되지 않음),
// fireEvent에 pageX를 그냥 넘기면 컴포넌트가 읽는 e.pageX가 undefined로 들어온다.
// Object.defineProperty로 이벤트 인스턴스에 직접 pageX를 심어서 실제 드래그 동작을 재현한다.
function fireMouseEvent(element, type, pageX) {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "pageX", { value: pageX, configurable: true });
  fireEvent(element, event);
}

describe("DragScrollRow", () => {
  test("children을 그대로 렌더링한다", () => {
    render(
      <DragScrollRow className="row">
        <button type="button">아이템1</button>
        <button type="button">아이템2</button>
      </DragScrollRow>,
    );

    expect(screen.getByText("아이템1")).toBeInTheDocument();
    expect(screen.getByText("아이템2")).toBeInTheDocument();
  });

  test("className prop을 컨테이너에 적용한다", () => {
    render(
      <DragScrollRow className="my-row" data-testid="drag-row">
        <span>내용</span>
      </DragScrollRow>,
    );

    expect(screen.getByTestId("drag-row")).toHaveClass("my-row");
  });

  test("마우스로 왼쪽으로 드래그하면 scrollLeft가 그만큼 증가한다", () => {
    render(
      <DragScrollRow className="row" data-testid="drag-row">
        <div>content</div>
      </DragScrollRow>,
    );
    const row = screen.getByTestId("drag-row");
    row.scrollLeft = 0;

    fireMouseEvent(row, "mousedown", 200);
    fireMouseEvent(row, "mousemove", 150); // 왼쪽으로 50px 이동
    fireMouseEvent(row, "mouseup", 150);

    expect(row.scrollLeft).toBe(50);
  });

  test("mouseUp 이후에는 더 이상 드래그가 반영되지 않는다", () => {
    render(
      <DragScrollRow className="row" data-testid="drag-row">
        <div>content</div>
      </DragScrollRow>,
    );
    const row = screen.getByTestId("drag-row");
    row.scrollLeft = 0;

    fireMouseEvent(row, "mousedown", 200);
    fireMouseEvent(row, "mousemove", 150);
    fireMouseEvent(row, "mouseup", 150);
    fireMouseEvent(row, "mousemove", 50);

    expect(row.scrollLeft).toBe(50);
  });

  test("드래그 중 영역을 벗어나면(mouseLeave) 드래그가 중단된다", () => {
    render(
      <DragScrollRow className="row" data-testid="drag-row">
        <div>content</div>
      </DragScrollRow>,
    );
    const row = screen.getByTestId("drag-row");
    row.scrollLeft = 0;

    fireMouseEvent(row, "mousedown", 200);
    fireMouseEvent(row, "mousemove", 150);
    fireEvent.mouseLeave(row);
    fireMouseEvent(row, "mousemove", 50);

    expect(row.scrollLeft).toBe(50);
  });

  test("5px 초과로 드래그한 뒤에는 이어지는 클릭이 무시된다", () => {
    const handleClick = jest.fn();
    render(
      <DragScrollRow className="row" data-testid="drag-row">
        <button type="button" onClick={handleClick}>
          카드
        </button>
      </DragScrollRow>,
    );
    const row = screen.getByTestId("drag-row");
    const button = screen.getByRole("button");
    row.scrollLeft = 0;

    fireMouseEvent(row, "mousedown", 200);
    fireMouseEvent(row, "mousemove", 180); // 20px 이동
    fireMouseEvent(row, "mouseup", 180);
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  test("5px 이하로 움직인 경우는 드래그로 인식하지 않아 클릭이 정상 동작한다", () => {
    const handleClick = jest.fn();
    render(
      <DragScrollRow className="row" data-testid="drag-row">
        <button type="button" onClick={handleClick}>
          카드
        </button>
      </DragScrollRow>,
    );
    const row = screen.getByTestId("drag-row");
    const button = screen.getByRole("button");
    row.scrollLeft = 0;

    fireMouseEvent(row, "mousedown", 200);
    fireMouseEvent(row, "mousemove", 197); // 3px 이동
    fireMouseEvent(row, "mouseup", 197);
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("드래그 없이 바로 클릭하면 onClick이 정상 호출된다", () => {
    const handleClick = jest.fn();
    render(
      <DragScrollRow className="row">
        <button type="button" onClick={handleClick}>
          카드
        </button>
      </DragScrollRow>,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

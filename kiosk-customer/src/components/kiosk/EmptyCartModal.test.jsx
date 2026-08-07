import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmptyCartModal from "./EmptyCartModal";

describe("EmptyCartModal", () => {
  test("안내 문구와 초기 카운트다운(5초)을 표시한다", () => {
    render(<EmptyCartModal onConfirm={() => {}} language="ko" />);

    expect(screen.getByText("주문목록이 비어있습니다")).toBeInTheDocument();
    expect(screen.getByText("(5초)")).toBeInTheDocument();
  });

  test("확인 버튼 클릭 시 즉시 onConfirm이 호출된다", async () => {
    const onConfirm = jest.fn();
    render(<EmptyCartModal onConfirm={onConfirm} language="ko" />);

    await userEvent.click(screen.getByText("확인"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test("5초가 지나면 자동으로 onConfirm이 호출된다", () => {
    jest.useFakeTimers();
    const onConfirm = jest.fn();
    render(<EmptyCartModal onConfirm={onConfirm} language="ko" />);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(onConfirm).toHaveBeenCalled();
    jest.useRealTimers();
  });
});

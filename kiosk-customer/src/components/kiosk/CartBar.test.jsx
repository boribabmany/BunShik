import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartBar from "./CartBar";

describe("CartBar", () => {
  test("장바구니 수량과 총액을 표시한다", () => {
    render(
      <CartBar
        count={3}
        total={12000}
        onCheckClick={() => {}}
        disabled={false}
        language="ko"
      />,
    );

    expect(screen.getByText("3개")).toBeInTheDocument();
    expect(screen.getByText("12,000원")).toBeInTheDocument();
  });

  test("비활성화 상태가 아니면 확인 버튼 클릭 시 onCheckClick이 호출된다", async () => {
    const onCheckClick = jest.fn();
    render(
      <CartBar
        count={1}
        total={4000}
        onCheckClick={onCheckClick}
        disabled={false}
        language="ko"
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "주문 확인" }));
    expect(onCheckClick).toHaveBeenCalledTimes(1);
  });

  test("disabled가 true면 확인 버튼이 비활성화된다", () => {
    render(
      <CartBar
        count={0}
        total={0}
        onCheckClick={() => {}}
        disabled={true}
        language="ko"
      />,
    );

    expect(screen.getByRole("button", { name: "주문 확인" })).toBeDisabled();
  });
});

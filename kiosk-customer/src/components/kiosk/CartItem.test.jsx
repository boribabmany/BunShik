import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartItem from "./CartItem";

const item = {
  menu_id: 1,
  menu_name: "떡볶이",
  menu_name_en: "Tteokbokki",
  image_url: "/tteokbokki.png",
  base_price: 4000,
  quantity: 2,
  options: [{ option_id: 1, option_name: "치즈추가", option_name_en: "Cheese", option_price: 500 }],
  components: [],
};

// document.fonts.ready 콜백(마이크로태스크)까지 반영되도록 flush
async function flush() {
  await act(async () => {
    await Promise.resolve();
  });
}

describe("CartItem", () => {
  test("메뉴 이름, 수량, 옵션, 합계를 표시한다", async () => {
    render(
      <CartItem
        item={item}
        onIncrease={() => {}}
        onDecrease={() => {}}
        onRemove={() => {}}
        language="ko"
      />,
    );
    await flush();

    expect(screen.getByText("떡볶이")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("+치즈추가")).toBeInTheDocument();
    // (4000 + 500) * 2 = 9000
    expect(screen.getByText("9,000원")).toBeInTheDocument();
  });

  test("+ 버튼 클릭 시 onIncrease가 호출된다", async () => {
    const onIncrease = jest.fn();
    render(
      <CartItem
        item={item}
        onIncrease={onIncrease}
        onDecrease={() => {}}
        onRemove={() => {}}
        language="ko"
      />,
    );
    await flush();

    await userEvent.click(screen.getByText("+"));
    expect(onIncrease).toHaveBeenCalledTimes(1);
  });

  test("- 버튼 클릭 시 onDecrease가 호출된다", async () => {
    const onDecrease = jest.fn();
    render(
      <CartItem
        item={item}
        onIncrease={() => {}}
        onDecrease={onDecrease}
        onRemove={() => {}}
        language="ko"
      />,
    );
    await flush();

    await userEvent.click(screen.getByText("-"));
    expect(onDecrease).toHaveBeenCalledTimes(1);
  });

  test("삭제 버튼 클릭 시 onRemove가 호출된다", async () => {
    const onRemove = jest.fn();
    render(
      <CartItem
        item={item}
        onIncrease={() => {}}
        onDecrease={() => {}}
        onRemove={onRemove}
        language="ko"
      />,
    );
    await flush();

    await userEvent.click(screen.getByAltText("삭제"));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

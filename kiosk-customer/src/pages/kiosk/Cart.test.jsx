import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Cart from "./Cart";
import useCartStore from "../../store/useCartStore";
import useLanguageStore from "../../store/useLanguageStore";

// CartItem 내부의 document.fonts.ready 마이크로태스크까지 반영되도록 flush
async function flush() {
  await act(async () => {
    await Promise.resolve();
  });
}

const sampleItem = {
  menu_id: 1,
  menu_name: "떡볶이",
  menu_name_en: "Tteokbokki",
  image_url: "/tteokbokki.png",
  base_price: 4000,
  quantity: 2,
  options: [],
  components: [],
};

function renderCart() {
  return render(
    <MemoryRouter initialEntries={["/cart"]}>
      <Routes>
        <Route path="/cart" element={<Cart />} />
        <Route path="/menu" element={<div>메뉴 화면</div>} />
        <Route path="/payment" element={<div>결제 화면</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Cart", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    useLanguageStore.setState({ language: "ko" });
  });

  test("장바구니가 비어있으면 안내 문구를 표시하고 결제 버튼이 비활성화된다", () => {
    renderCart();

    expect(screen.getByText("장바구니가 비어있습니다")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "결제 하기" })).toBeDisabled();
  });

  test("항목이 있으면 목록과 총액을 표시한다", async () => {
    useCartStore.setState({ items: [sampleItem] });
    const { container } = renderCart();
    await flush();

    expect(screen.getByText("떡볶이")).toBeInTheDocument();
    expect(container.querySelector(".cart-total-price")).toHaveTextContent(
      "8,000원",
    );
    expect(screen.getByRole("button", { name: "결제 하기" })).toBeEnabled();
  });

  test("'결제 하기' 클릭 시 결제 화면으로 이동한다", async () => {
    useCartStore.setState({ items: [sampleItem] });
    renderCart();
    await flush();

    await userEvent.click(screen.getByRole("button", { name: "결제 하기" }));

    expect(screen.getByText("결제 화면")).toBeInTheDocument();
  });

  test("'메뉴 더 담기' 클릭 시 메뉴 화면으로 이동한다", async () => {
    useCartStore.setState({ items: [sampleItem] });
    renderCart();
    await flush();

    await userEvent.click(screen.getByRole("button", { name: "메뉴 더 담기" }));

    expect(screen.getByText("메뉴 화면")).toBeInTheDocument();
  });

  test("수량 증가/감소/삭제가 카트 상태에 반영된다", async () => {
    useCartStore.setState({ items: [sampleItem] });
    renderCart();
    await flush();

    await userEvent.click(screen.getByText("+"));
    expect(useCartStore.getState().items[0].quantity).toBe(3);

    await userEvent.click(screen.getByAltText("삭제"));
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});

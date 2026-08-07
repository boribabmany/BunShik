import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import useOrderStore from "../../store/useOrderStore";
import useLanguageStore from "../../store/useLanguageStore";

function renderHome() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<div>메뉴 화면</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Home", () => {
  beforeEach(() => {
    useOrderStore.setState({ orderType: null });
    useLanguageStore.setState({ language: "ko" });
  });

  test("안내 문구와 매장식사/포장하기 버튼을 표시한다", () => {
    renderHome();

    expect(screen.getByText(/아래 버튼을 눌러주세요/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /매장.*식사/s }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /포장.*하기/s }),
    ).toBeInTheDocument();
  });

  test("'매장식사' 클릭 시 orderType이 dine-in으로 설정되고 메뉴 화면으로 이동한다", async () => {
    renderHome();

    await userEvent.click(screen.getByRole("button", { name: /매장.*식사/s }));

    expect(useOrderStore.getState().orderType).toBe("dine-in");
    expect(screen.getByText("메뉴 화면")).toBeInTheDocument();
  });

  test("'포장하기' 클릭 시 orderType이 takeout으로 설정되고 메뉴 화면으로 이동한다", async () => {
    renderHome();

    await userEvent.click(screen.getByRole("button", { name: /포장.*하기/s }));

    expect(useOrderStore.getState().orderType).toBe("takeout");
    expect(screen.getByText("메뉴 화면")).toBeInTheDocument();
  });

  test("언어 버튼 클릭 시 언어가 변경된다", async () => {
    renderHome();

    await userEvent.click(screen.getByAltText("English"));

    expect(useLanguageStore.getState().language).toBe("en");
    expect(screen.getByText(/please press the button below/)).toBeInTheDocument();
  });
});

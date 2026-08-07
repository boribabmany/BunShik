import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MenuCard from "./MenuCard";

const menu = {
  menu_id: 1,
  menu_name: "떡볶이",
  menu_name_en: "Tteokbokki",
  image_url: "/tteokbokki.png",
  price: 4000,
  is_available: true,
};

describe("MenuCard", () => {
  test("메뉴 이름과 가격을 표시한다 (한국어)", () => {
    render(<MenuCard menu={menu} onClick={() => {}} language="ko" />);

    expect(screen.getByText("떡볶이")).toBeInTheDocument();
    expect(screen.getByText("4,000원")).toBeInTheDocument();
  });

  test("영어 모드에서는 영문 이름과 통화 기호를 표시한다", () => {
    render(<MenuCard menu={menu} onClick={() => {}} language="en" />);

    expect(screen.getByText("Tteokbokki")).toBeInTheDocument();
    expect(screen.getByText("₩4,000")).toBeInTheDocument();
  });

  test("버튼 클릭 시 onClick이 호출된다", async () => {
    const handleClick = jest.fn();
    render(<MenuCard menu={menu} onClick={handleClick} language="ko" />);

    await userEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("품절 메뉴는 '품절'이 표시되고 버튼이 비활성화된다", () => {
    const soldOutMenu = { ...menu, is_available: false };
    render(<MenuCard menu={soldOutMenu} onClick={() => {}} language="ko" />);

    expect(screen.getByText("품절")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

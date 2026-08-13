/**
 * 적용 화면: 관리자 로그인 페이지 (/adminlogin)
 * 테스트 내용: 로그인 성공 시 토큰 저장과 화면 이동, 실패 시 오류 표시를 검증한다.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminLogin from "../pages/admin/AdminLogin";
import { login } from "../api/adminApi";

const mockNavigate = jest.fn();

jest.mock("../api/adminApi", () => ({
  login: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("관리자 로그인 화면", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    sessionStorage.clear();
  });

  const renderPage = () => render(<AdminLogin />);

  const submitLogin = () => {
    fireEvent.change(screen.getByPlaceholderText("아이디 입력"), {
      target: { value: " admin " },
    });
    fireEvent.change(screen.getByPlaceholderText("비밀번호 입력"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));
  };

  test("로그인 성공 시 토큰을 저장하고 관리자 메뉴로 이동한다", async () => {
    login.mockResolvedValue({
      data: {
        accessToken: "test-access-token",
      },
    });
    renderPage();

    submitLogin();

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("admin", "password123");
      expect(sessionStorage.getItem("accessToken"))
        .toBe("test-access-token");
      expect(sessionStorage.getItem("isAdminLoggedIn")).toBe("true");
      expect(mockNavigate).toHaveBeenCalledWith("/adminmenu");
    });
  });

  test("로그인 실패 시 저장값을 지우고 백엔드 메시지를 표시한다", async () => {
    sessionStorage.setItem("accessToken", "old-token");
    sessionStorage.setItem("isAdminLoggedIn", "false");
    login.mockRejectedValue({
      response: {
        data: {
          message: "아이디 또는 비밀번호가 올바르지 않습니다.",
        },
      },
    });
    renderPage();

    submitLogin();

    await waitFor(() => {
      expect(sessionStorage.getItem("accessToken")).toBeNull();
      expect(sessionStorage.getItem("isAdminLoggedIn")).toBeNull();
      expect(window.alert).toHaveBeenCalledWith(
        "아이디 또는 비밀번호가 올바르지 않습니다.",
      );
    });
  });
});

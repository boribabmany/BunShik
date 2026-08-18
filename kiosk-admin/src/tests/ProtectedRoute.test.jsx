import { act, fireEvent, render, screen } from "@testing-library/react";
import ProtectedRoute from "../components/admin/shared/ProtectedRoute";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  Navigate: () => <div>로그인 이동</div>,
  Outlet: () => <div>관리자 화면</div>,
  useNavigate: () => mockNavigate,
}));
jest.mock("../components/admin/shared/NewOrderToast", () => () => null);

describe("관리자 자동 로그아웃 경고", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    sessionStorage.setItem("accessToken", "token");
    sessionStorage.setItem("isAdminLoggedIn", "true");
  });

  afterEach(() => {
    jest.useRealTimers();
    sessionStorage.clear();
  });

  test("59분간 활동이 없으면 경고하고 계속 사용 시 타이머를 초기화한다", () => {
    render(<ProtectedRoute />);

    act(() => jest.advanceTimersByTime(59 * 60 * 1000));
    expect(screen.getByRole("alertdialog")).toBeTruthy();
    expect(screen.getByText(/60초 후 자동 로그아웃/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "계속 사용" }));
    expect(screen.queryByRole("alertdialog")).toBeNull();

    act(() => jest.advanceTimersByTime(60 * 1000));
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("accessToken")).toBe("token");
  });

  test("경고창에서 로그아웃하면 인증 정보를 삭제한다", () => {
    render(<ProtectedRoute />);
    act(() => jest.advanceTimersByTime(59 * 60 * 1000));
    fireEvent.click(screen.getByRole("button", { name: "로그아웃" }));

    expect(sessionStorage.getItem("accessToken")).toBeNull();
    expect(sessionStorage.getItem("isAdminLoggedIn")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/adminlogin", { replace: true });
  });
});

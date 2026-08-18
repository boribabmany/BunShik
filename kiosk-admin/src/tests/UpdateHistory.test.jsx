import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UpdateHistory from "../components/admin/menu/UpdateHistory";
import { getHistory } from "../api/historyAPI";

jest.mock("../api/historyAPI", () => ({ getHistory: jest.fn() }));

describe("UpdateHistory", () => {
  beforeEach(() => jest.clearAllMocks());

  test("관리자, 발생 시각, 대상과 변경 전후 값을 표시한다", async () => {
    getHistory.mockResolvedValue([{
      id: 1,
      title: "판매 상태 변경",
      description: "떡볶이 판매 상태를 변경했습니다.",
      adminName: "김관리",
      createdAt: "2026-08-18T13:30:00",
      target: "떡볶이",
      beforeValue: "판매중",
      afterValue: "판매중지",
    }]);

    render(<UpdateHistory />);
    expect(await screen.findByText("판매 상태 변경")).toBeTruthy();
    expect(screen.getByText("김관리")).toBeTruthy();
    expect(screen.getByText("떡볶이", { selector: "dd" })).toBeTruthy();
    expect(screen.getByText("판매중")).toBeTruthy();
    expect(screen.getByText("판매중지")).toBeTruthy();
    expect(screen.getByText("처리 시간")).toBeTruthy();
  });

  test("관리자 이름 없이 숫자 ID만 있으면 관리자로 표시한다", async () => {
    getHistory.mockResolvedValue([{
      id: 2,
      title: "메뉴 수정",
      admin_id: 1,
      created_at: "2026-08-18T14:10:00",
    }]);

    render(<UpdateHistory />);
    expect(await screen.findByText("관리자")).toBeTruthy();
    expect(screen.queryByText("1", { selector: "dd" })).toBeNull();
    expect(screen.getByText("처리 시간")).toBeTruthy();
  });

  test("이력이 없으면 빈 상태를 표시한다", async () => {
    getHistory.mockResolvedValue([]);
    render(<UpdateHistory />);
    expect(await screen.findByText("아직 등록된 변경 이력이 없습니다.")).toBeTruthy();
  });

  test("조회 실패 후 다시 시도할 수 있다", async () => {
    getHistory.mockRejectedValueOnce(new Error("network")).mockResolvedValueOnce([]);
    render(<UpdateHistory />);
    fireEvent.click(await screen.findByRole("button", { name: "다시 시도" }));
    await waitFor(() => expect(getHistory).toHaveBeenCalledTimes(2));
    expect(await screen.findByText("아직 등록된 변경 이력이 없습니다.")).toBeTruthy();
  });
});

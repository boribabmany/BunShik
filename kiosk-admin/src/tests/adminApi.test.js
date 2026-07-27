import api from "../api/axios";
import { login } from "../api/adminApi";

jest.mock("../api/axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe("관리자 로그인 API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("아이디와 비밀번호를 전송하고 로그인 응답을 반환한다", async () => {
    const loginResponse = {
      success: true,
      data: {
        adminId: 1,
        username: "admin",
        accessToken: "test-access-token",
        tokenType: "Bearer",
      },
    };
    api.post.mockResolvedValue({ data: loginResponse });

    await expect(login("admin", "1234")).resolves.toEqual(loginResponse);
    expect(api.post).toHaveBeenCalledWith("/api/admin/login", {
      username: "admin",
      password: "1234",
    });
  });

  test("아이디가 올바르지 않으면 로그인 요청이 실패한다", async () => {
    const error = new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
    api.post.mockRejectedValue(error);

    await expect(login("user", "1234")).rejects.toThrow(
      "아이디 또는 비밀번호가 올바르지 않습니다.",
    );
  });

  test("비밀번호가 올바르지 않으면 로그인 요청이 실패한다", async () => {
    const error = new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
    api.post.mockRejectedValue(error);

    await expect(login("admin", "1111")).rejects.toThrow(
      "아이디 또는 비밀번호가 올바르지 않습니다.",
    );
  });
});

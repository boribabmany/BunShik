import { login } from "../api/adminApi";

describe("관리자 로그인", () => {
  beforeAll(() => {
    process.env.REACT_APP_ADMIN_ID = "admin";
    process.env.REACT_APP_ADMIN_PASSWORD = "1234";
  });

  test("올바른 아이디와 비밀번호로 로그인 성공", () => {
    expect(login("admin", "1234")).toBe(true);
  });

  test("잘못된 아이디로 로그인 실패", () => {
    expect(login("user", "1234")).toBe(false);
  });

  test("잘못된 비밀번호로 로그인 실패", () => {
    expect(login("admin", "1111")).toBe(false);
  });
});
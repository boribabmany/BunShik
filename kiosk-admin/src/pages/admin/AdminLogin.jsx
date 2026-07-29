import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/adminApi";
import logo from "../../images/bunshiklogo.png";
import "../../styles/AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await login(id.trim(), password);
      const accessToken = result?.data?.accessToken;

      if (!accessToken) {
        throw new Error("로그인 응답에 인증 토큰이 없습니다.");
      }

      // JWT 저장
      sessionStorage.setItem("accessToken", accessToken);

      // 로그인 여부 저장
      sessionStorage.setItem("isAdminLoggedIn", "true");

      navigate("/adminmenu");
    } catch (error) {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("isAdminLoggedIn");

      const message =
        error.response?.data?.message ||
        error.message ||
        "아이디 또는 비밀번호가 올바르지 않습니다.";

      alert(message);
    }
  };

  // 이미 로그인된 경우
  useEffect(() => {
    const isLogin = sessionStorage.getItem("isAdminLoggedIn") === "true";

    if (isLogin) {
      navigate("/adminmenu");
    }
  }, [navigate]);

  return (
    <div className="login-page">
      <div className="login-box">
        <img src={logo} alt="분식 로고" className="login-logo" />

        <h1 className="login-title">
          관리자 로그인
        </h1>

        <div className="login-info">
          <span>비밀번호를 잊으셨나요?</span>
          <span>본점에 문의바람</span>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="아이디 입력"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoComplete="username"
            required
          />

          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
}

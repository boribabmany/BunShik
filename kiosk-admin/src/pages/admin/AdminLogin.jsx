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
      const result = await login(id, password);

      // 백엔드에서 JWT를 반환하는 경우
      sessionStorage.setItem("token", result.token);

      sessionStorage.setItem("isAdminLoggedIn", "true");

      navigate("/adminmenu");
    } catch (error) {
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  // 이미 로그인된 경우
  useEffect(() => {
    const isLogin =
      sessionStorage.getItem("isAdminLoggedIn") === "true";

    if (isLogin) {
      navigate("/adminmenu");
    }
  }, [navigate]);

  return (
    <div className="login-page">
      <div className="login-box">
        <img src={logo} alt="분식 로고" className="login-logo" />

        <h1 className="login-title">
          관리자 로그인(아이디 admin / 비밀번호 1234)
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
          />

          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
}
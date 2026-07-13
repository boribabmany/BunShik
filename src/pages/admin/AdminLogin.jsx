import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/adminApi";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (login(id, password)) {
      navigate("/adminmenu");
    } else {
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div>
      <div>

        <div>
          <p>맛있는 분식집</p>
        </div>

        <h1>
          관리자 로그인
        </h1>

        <div>
          <span>비밀번호를 잊으셨나요?</span>
          <span>가입 요청</span>
        </div>

        <form onSubmit={handleLogin}>

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

          <button type="submit">
            로그인
          </button>

        </form>

      </div>
    </div>
  );
}
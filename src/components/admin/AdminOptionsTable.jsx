//adminmenu 옵션테이블
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminOptionsTable() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div>

      <h2>옵션 리스트</h2>

      <table>
        {/* 옵션 목록 */}
      </table>

      <button onClick={() => setOpen(true)}>
        옵션 수정
      </button>

      {open && (
        <div>

          <div>

            <h2>옵션 수정</h2>

            <button onClick={() => navigate("/adminmenuedit")}>
              수정페이지 가기
            </button>

            <button onClick={() => setOpen(false)}>
              X
            </button>

            {/* 등록 폼 */}

          </div>

        </div>
      )}

    </div>
  );
}
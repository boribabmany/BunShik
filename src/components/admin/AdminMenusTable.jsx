// adminmenu 메뉴테이블

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminMenusTable() {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div>

      <h2>메뉴 리스트</h2>

      <table>
        {/* 메뉴 목록 */}
      </table>

      <button onClick={() => setOpen(true)}>
        메뉴 수정
      </button>

      {open && (
        <div>

          <h2>메뉴 수정</h2>

          <button onClick={() => navigate("/adminmenuedit")}>
            수정페이지 가기
          </button>

          <button onClick={() => setOpen(false)}>
            X
          </button>

        </div>
      )}

    </div>
  );
}
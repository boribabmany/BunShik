import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminOrder() {

  const navigate = useNavigate();

  const [date, setDate] = useState("2025-05-20");
  const [type, setType] = useState("전체");
  const [status, setStatus] = useState("전체");


  // 임시 주문 데이터 (DB 상태값 기준)
  const orders = [
    {
      orderNo: "A-001",
      orderTime: "2025-05-20 11:30",
      orderType: "포장",
      status: "완료",
      amount: 9500
    },
    {
      orderNo: "A-002",
      orderTime: "2025-05-20 12:20",
      orderType: "먹고",
      status: "완료",
      amount: 10000
    },
    {
      orderNo: "A-003",
      orderTime: "2025-05-20 13:05",
      orderType: "포장",
      status: "접수",
      amount: 8000
    },
    {
      orderNo: "A-004",
      orderTime: "2025-05-20 14:05",
      orderType: "포장",
      status: "조리중",
      amount: 10000
    },
    {
      orderNo: "A-005",
      orderTime: "2025-05-20 14:50",
      orderType: "먹고",
      status: "취소",
      amount: 12000
    }
  ];


  // 상태 변경 버튼
  const handleStatusChange = (order) => {

    if(order.status === "접수") {
      alert(`${order.orderNo} 조리 시작`);
    }

    else if(order.status === "조리중") {
      alert(`${order.orderNo} 조리 완료`);
    }

    else if(order.status === "완료") {
      alert(`${order.orderNo} 완료 상태입니다`);
    }

    else {
      alert(`${order.orderNo} 취소된 주문입니다`);
    }

  };


  return (
    <div>

      <header>
        <h1>주문 관리</h1>
      </header>


      {/* 검색 영역 */}
      <section>

        <input
          type="date"
          value={date}
          onChange={(e)=>setDate(e.target.value)}
        />


        <select
          value={type}
          onChange={(e)=>setType(e.target.value)}
        >
          <option>전체</option>
          <option>포장</option>
          <option>먹고</option>
        </select>


        <select
          value={status}
          onChange={(e)=>setStatus(e.target.value)}
        >
          <option>전체</option>
          <option>접수</option>
          <option>조리중</option>
          <option>완료</option>
          <option>취소</option>
        </select>


        <button>
          🔍 검색
        </button>

      </section>



      {/* 주문 테이블 */}
      <table border="1">

        <thead>
          <tr>
            <th>주문번호</th>
            <th>주문시간</th>
            <th>주문유형</th>
            <th>상태</th>
            <th>주문금액</th>
            <th>관리</th>
          </tr>
        </thead>


        <tbody>

        {orders.map((order,index)=>(

          <tr key={index}>

            <td>{order.orderNo}</td>

            <td>{order.orderTime}</td>

            <td>{order.orderType}</td>

            <td>
              {order.status}
            </td>

            <td>
              {order.amount.toLocaleString()}원
            </td>


            <td>

              <button
                onClick={()=>handleStatusChange(order)}
                disabled={
                  order.status === "완료" ||
                  order.status === "취소"
                }
              >
                {
                  order.status === "접수"
                  ? "조리 시작"
                  : order.status === "조리중"
                  ? "조리 완료"
                  : order.status === "완료"
                  ? "완료"
                  : "취소"
                }
              </button>


            </td>

          </tr>

        ))}

        </tbody>

      </table>



      {/* 더보기 */}
      <button>
        더 보기 (Load More)
      </button>



      {/* 뒤로가기 */}
      <button
        onClick={()=>navigate("/adminmenu")}
      >
        뒤로가기
      </button>


    </div>
  );
}

//DB 적용되면 변경예정 임시
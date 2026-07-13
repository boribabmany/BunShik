import { useNavigate } from "react-router-dom";
import useOrderStore from "../../store/useOrderStore";

function OrderComplete() {
  const navigate = useNavigate();
  const orderNumber = useOrderStore((state) => state.orderNumber);
  const totalPrice = useOrderStore((state) => state.totalPrice);
  const resetOrder = useOrderStore((state) => state.resetOrder);

  const handleReceiptPrint = () => {
    window.print(); // 임시: 브라우저 인쇄 기능으로 영수증 흉내
  };

  const handleGoHome = () => {
    resetOrder();
    navigate("/");
  };

  return (
    <div>
      <h1>주문이 완료되었습니다!</h1>
      <p>맛있게 준비해 드릴게요. 잠시만 기다려주세요</p>

      <div>
        <p>주문번호</p>
        <p>{orderNumber}</p>
      </div>

      <div>
        <span>총 결제 금액</span>
        <span>{totalPrice?.toLocaleString()}원</span>
      </div>

      <button type="button" onClick={handleReceiptPrint}>
        영수증 출력
      </button>

      <button type="button" onClick={handleGoHome}>
        처음으로
      </button>
    </div>
  );
}

export default OrderComplete;

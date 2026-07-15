import { useNavigate } from "react-router-dom";
import useOrderStore from "../../store/useOrderStore";
import checkIcon from "../../images/check.png";
import "../../App.css";

function OrderComplete() {
  const navigate = useNavigate();
  const orderNumber = useOrderStore((state) => state.orderNumber);
  const totalPrice = useOrderStore((state) => state.totalPrice);
  const resetOrder = useOrderStore((state) => state.resetOrder);

  const handleReceiptPrint = () => {
    window.print();
  };

  const handleGoHome = () => {
    resetOrder();
    navigate("/");
  };

  return (
    <div className="complete-screen">
      <div className="complete-check-circle">
        <img src={checkIcon} alt="완료" className="complete-check-icon" />
      </div>

      <h1 className="complete-title">주문이 완료되었습니다!</h1>

      <p className="complete-subtitle">
        맛있게 준비해 드릴게요.
        <br />
        잠시만 기다려주세요
      </p>

      <div className="complete-order-card">
        <p className="complete-order-label">주문번호</p>
        <p className="complete-order-number">{orderNumber}</p>
      </div>

      <p className="complete-total-label">총 결제 금액</p>
      <p className="complete-total-price">{totalPrice?.toLocaleString()}원</p>

      <button
        type="button"
        onClick={handleReceiptPrint}
        className="complete-receipt-button"
      >
        영수증 출력
      </button>

      <button
        type="button"
        onClick={handleGoHome}
        className="complete-home-button"
      >
        처음으로
      </button>
    </div>
  );
}

export default OrderComplete;

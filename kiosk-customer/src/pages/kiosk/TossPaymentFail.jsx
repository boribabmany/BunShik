import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { failTossPayment } from "../../api/orderApi";

function TossPaymentFail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const kioskOrderId = Number(searchParams.get("kioskOrderId"));
    const message = searchParams.get("message") || "결제가 취소되었습니다.";

    failTossPayment({ order_id: kioskOrderId, message }).finally(() => {
      navigate("/payment", { replace: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <p>결제 화면으로 돌아가는 중...</p>
    </div>
  );
}

export default TossPaymentFail;

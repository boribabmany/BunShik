import { useNavigate } from "react-router-dom";
import useOrderStore from "../../store/useOrderStore";
import logo from "../../images/bunshiklogo.png";

function Home() {
  const navigate = useNavigate();
  const setOrderType = useOrderStore((state) => state.setOrderType);

  const handleSelect = (orderType) => {
    setOrderType(orderType);
    navigate("/menu");
  };

  return (
    <div>
      <div>
        <button type="button">한국어</button>
        <button type="button">English</button>
      </div>

      <img src={logo} alt="분식집 로고" />

      <p>주문을 시작하려면 아래 버튼을 눌러주세요</p>

      <button type="button" onClick={() => handleSelect("dine-in")}>
        매장에서 먹기
      </button>

      <button type="button" onClick={() => handleSelect("takeout")}>
        포장하기
      </button>
    </div>
  );
}

export default Home;

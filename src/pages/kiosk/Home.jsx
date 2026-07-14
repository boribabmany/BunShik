import { useNavigate } from "react-router-dom";
import useOrderStore from "../../store/useOrderStore";
import logo from "../../images/bunshiklogo.png";
import korea from "../../images/korea.png";
import usa from "../../images/usa.png";
import eatinIcon from "../../images/eatinicon.png";
import takeoutIcon from "../../images/takeout.png";
import "../../App.css";

function Home() {
  const navigate = useNavigate();
  const setOrderType = useOrderStore((state) => state.setOrderType);

  const handleSelect = (orderType) => {
    setOrderType(orderType);
    navigate("/menu");
  };

  return (
    <div className="home-screen">
      <div className="home-lang-buttons">
        <button type="button" className="home-lang-button">
          <img src={korea} alt="한국어" />
        </button>
        <button type="button" className="home-lang-button">
          <img src={usa} alt="English" />
        </button>
      </div>

      <img src={logo} alt="분식집 로고" className="home-logo" />

      <p className="home-guide">
        주문을 시작하려면
        <br />
        아래 버튼을 눌러주세요
      </p>

      <button
        type="button"
        className="home-order-button home-dine-in"
        onClick={() => handleSelect("dine-in")}
      >
        <img
          src={eatinIcon}
          alt=""
          className="home-order-icon home-dine-in-icon"
        />
        <span>매장에서 먹기</span>
      </button>

      <button
        type="button"
        className="home-order-button home-takeout"
        onClick={() => handleSelect("takeout")}
      >
        <img
          src={takeoutIcon}
          alt=""
          className="home-order-icon home-takeout-icon"
        />
        <span>포장하기</span>
      </button>
    </div>
  );
}

export default Home;

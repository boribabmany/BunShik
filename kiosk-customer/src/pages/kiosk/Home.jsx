import { useNavigate } from "react-router-dom";
import useOrderStore from "../../store/useOrderStore";
import useLanguageStore from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import logo from "../../images/bunshiklogo.png";
import korea from "../../images/korea.png";
import usa from "../../images/usa.png";
import eatinIcon from "../../images/eatinicon.png";
import takeoutIcon from "../../images/takeout.png";
import "../../styles/common.css";
import "../../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const setOrderType = useOrderStore((state) => state.setOrderType);
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const t = translations[language].home;

  const handleSelect = (orderType) => {
    setOrderType(orderType);
    navigate("/menu");
  };

  return (
    <div className="home-screen">
      <div className="home-lang-buttons">
        <button
          type="button"
          className={`home-lang-button ${language === "ko" ? "active" : ""}`}
          onClick={() => setLanguage("ko")}
        >
          <img src={korea} alt="한국어" />
        </button>
        <button
          type="button"
          className={`home-lang-button ${language === "en" ? "active" : ""}`}
          onClick={() => setLanguage("en")}
        >
          <img src={usa} alt="English" />
        </button>
      </div>

      <img src={logo} alt="분식집 로고" className="home-logo" />

      <p className="home-guide">
        {t.guide1}
        <br />
        {t.guide2}
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
        <span className="home-order-text home-dine-in-text">
          {t.dineIn.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </span>
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
        <span className="home-order-text home-takeout-text">
          {t.takeout.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </span>
      </button>
    </div>
  );
}

export default Home;

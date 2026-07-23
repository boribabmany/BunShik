import { useEffect, useState } from "react";
import { getHistory } from "../../api/historyAPI";

export default function UpdateHistory() {

  const [histories, setHistories] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getHistory();
        setHistories(data);
      } catch (error) {
        console.error("변경 내역 조회 실패", error);
      }
    };

    loadHistory();
  }, []);


  return (
    <div className="history-box">

      <h3 className="history-title">
        최근 변경 내역
      </h3>

      <div className="history-list">

        {histories.map((history) => (
          <div 
            key={history.id}
            className="history-item"
          >
            <strong>
              {history.title}
            </strong>

            <p>
              {history.description}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}
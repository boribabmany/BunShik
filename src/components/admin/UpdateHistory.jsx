// 변경내역 임시
import useHistoryStore from "../../store/historyStore";

export default function UpdateHistory() {
  const { histories } = useHistoryStore();

  return (
    <div className="history-box">
      <h3 className="history-title">최근 변경 내역</h3>

      <div className="history-list">
        {histories.map((history) => (
          <div key={history.id} className="history-item">
            <strong>{history.title}</strong>
            <p>{history.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

//백엔드 작성후

/*import { useEffect, useState } from "react";
import { getHistory } from "../../api/historyApi";

export default function UpdateHistory() {

  const [histories, setHistories] = useState([]);

  useEffect(() => {
    getHistory()
      .then((res) => {
        setHistories(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h3>최근 변경 내역</h3>

      {histories.map((history) => (
        <div key={history.id}>
          <strong>{history.title}</strong>
          <p>{history.description}</p>
        </div>
      ))}
    </div>
  );
}
핵심내용이 아닌 추가내용이므로 기본공사 끝난후에 작성, DB도  
*/
import { useCallback, useEffect, useState } from "react";
import { getHistory } from "../../api/historyAPI";

const firstValue = (history, keys) => {
  for (const key of keys) {
    const value = history?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
};

const formatHistoryTime = (value) => {
  if (!value) return "시간 정보 없음";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(date);
};

const formatAdmin = (history) => {
  const name = firstValue(history, [
    "adminName", "admin_name", "username", "adminUsername", "admin_username",
  ]);
  if (name) return name;

  const adminId = firstValue(history, ["adminId", "admin_id"]);
  return adminId ? "관리자" : "관리자 정보 없음";
};

const getHistoryView = (history) => ({
  id: firstValue(history, ["id", "historyId", "history_id"]),
  title: firstValue(history, ["title", "action", "actionName"]) || "관리자 작업",
  description: firstValue(history, ["description", "detail", "message"]) || "상세 내용이 없습니다.",
  admin: formatAdmin(history),
  createdAt: formatHistoryTime(firstValue(history, [
    "createdAt", "created_at", "processedAt", "processed_at", "updatedAt",
    "updated_at", "historyDate", "history_date", "actionAt", "action_at",
    "timestamp", "date",
  ])),
  target: firstValue(history, ["target", "targetName", "target_name"]),
  before: firstValue(history, ["before", "beforeValue", "before_value"]),
  after: firstValue(history, ["after", "afterValue", "after_value"]),
});

export default function UpdateHistory() {
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const data = await getHistory();
      setHistories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("변경 이력 조회 실패", error);
      setHistories([]);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <section className="history-box" aria-labelledby="history-title">
      <div className="history-header">
        <h3 id="history-title" className="history-title">최근 변경 내역</h3>
      </div>

      <div className="history-list" aria-live="polite">
        {isLoading && <p className="history-state">변경 이력을 불러오는 중...</p>}
        {!isLoading && hasError && (
          <div className="history-state history-error" role="alert">
            <p>변경 이력을 불러오지 못했습니다.</p>
            <button type="button" onClick={loadHistory}>다시 시도</button>
          </div>
        )}
        {!isLoading && !hasError && histories.length === 0 && (
          <p className="history-state">아직 등록된 변경 이력이 없습니다.</p>
        )}
        {!isLoading && !hasError && histories.map((history, index) => {
          const item = getHistoryView(history);
          return (
            <article key={item.id ?? `${item.createdAt}-${index}`} className="history-item">
              <div className="history-item-heading">
                <strong>{item.title}</strong>
                <time><span>처리 시간</span>{item.createdAt}</time>
              </div>
              <p>{item.description}</p>
              <dl className="history-meta">
                <div><dt>처리자</dt><dd>{item.admin}</dd></div>
                {item.target && <div><dt>대상</dt><dd>{item.target}</dd></div>}
                {(item.before || item.after) && (
                  <div className="history-change">
                    <dt>변경</dt>
                    <dd><span>{item.before || "-"}</span><span aria-hidden="true">→</span><span>{item.after || "-"}</span></dd>
                  </div>
                )}
              </dl>
            </article>
          );
        })}
      </div>
    </section>
  );
}

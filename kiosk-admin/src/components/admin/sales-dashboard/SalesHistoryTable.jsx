import { useEffect, useState } from "react";

export default function SalesHistoryTable({ salesHistory = [], periodRange }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentSales = salesHistory.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const totalPages = Math.ceil(salesHistory.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [salesHistory]);

  return (
    <div className="sales-history">
      <h2>매출 현황</h2>
      <p className="sales-section-period">{periodRange}</p>

      <table className="sales-history-table">
        <thead>
          <tr>
            <th>날짜</th>
            <th>주문수</th>
            <th>매출</th>
          </tr>
        </thead>

        <tbody>
          {currentSales.length === 0 ? (
            <tr>
              <td colSpan="3" className="sales-table-empty">
                매출 데이터가 없습니다.
              </td>
            </tr>
          ) : currentSales.map((item) => (
            <tr key={item.salesDate}>
              <td>{item.salesDate}</td>

              <td>{item.orderCount ?? 0}건</td>

              <td>₩{(item.totalSales ?? 0).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>}
    </div>
  );
}

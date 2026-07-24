import { useEffect, useState } from "react";
import useSalesStore from "../../store/salesStore";

export default function SalesHistoryTable() {
  const { salesHistory, loadSalesHistory } = useSalesStore();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadSalesHistory();
  }, [loadSalesHistory]);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentSales = salesHistory.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(salesHistory.length / itemsPerPage);

  return (
    <div className="sales-history">
      <h2>최근 30일 매출 현황</h2>

      <table className="sales-history-table">
        <thead>
          <tr>
            <th>날짜</th>
            <th>주문수</th>
            <th>매출</th>
          </tr>
        </thead>

        <tbody>
          {currentSales.map((item) => (
            <tr key={item.salesDate}>
              <td>{item.salesDate}</td>

              <td>
                {item.orderCount ?? 0}건
              </td>

              <td>
                ₩{(item.totalSales ?? 0).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <div className="pagination">

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

      </div>

    </div>
  );
}
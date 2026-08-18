import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function PopularMenu({ popularMenus = [], periodRange }) {
  const chartData = popularMenus
    .slice(0, 10)
    .map((menu) => ({
      name: menu.menuName,
      quantity: Number(menu.quantity ?? menu.orderCount ?? 0),
      totalSales: Number(menu.totalSales ?? 0),
    }));

  return (
    <div className="popular-menu">
      <div className="chart-card-header">
        <div>
          <h2>메뉴별 통계</h2>
          <p>{periodRange} · 매출 상위 10개</p>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="popular-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 20, bottom: 4, left: 10 }}
            >
              <CartesianGrid stroke="#e8eaed" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#68717e", fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={82}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#343940", fontSize: 13 }}
              />
              <Tooltip
                cursor={{ fill: "#f7f9fb" }}
                formatter={(value, _, item) => [
                  `${Number(value).toLocaleString()}개 · ₩${Number(
                    item.payload.totalSales,
                  ).toLocaleString()}`,
                  "판매 실적",
                ]}
              />
              <Bar
                dataKey="quantity"
                name="판매 수량"
                fill="#66885f"
                radius={[0, 7, 7, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="sales-chart-empty">인기 메뉴 데이터가 없습니다.</div>
      )}
    </div>
  );
}

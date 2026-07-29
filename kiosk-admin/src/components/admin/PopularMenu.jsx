import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useSalesStore from "../../store/salesStore";

export default function PopularMenu() {
  const popularMenus = useSalesStore((state) => state.popularMenus);
  const chartData = popularMenus.map((menu) => ({
    name: menu.menuName,
    orderCount: Number(menu.orderCount ?? 0),
  }));

  return (
    <div className="popular-menu">
      <div className="chart-card-header">
        <div>
          <h2>인기 메뉴 TOP 5</h2>
          <p>최근 한 달 주문 수 기준</p>
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
                formatter={(value) => [`${Number(value).toLocaleString()}개`, "주문 수"]}
              />
              <Bar
                dataKey="orderCount"
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

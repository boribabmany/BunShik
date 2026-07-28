import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useSalesStore from "../../store/salesStore";

const formatShortDate = (date) => {
  const [, month, day] = String(date).split("-");
  return month && day ? `${month}.${day}` : date;
};

export default function SalesTrendChart() {
  const salesHistory = useSalesStore((state) => state.salesHistory);
  const chartData = [...salesHistory].reverse().map((item) => ({
    date: formatShortDate(item.salesDate),
    fullDate: item.salesDate,
    sales: Number(item.totalSales ?? 0),
    orders: Number(item.orderCount ?? 0),
  }));

  return (
    <div className="sales-trend-chart">
      <div className="chart-card-header">
        <div>
          <h2>최근 30일 매출 추이</h2>
          <p>일별 매출액과 주문 수 변화</p>
        </div>
        <div className="chart-legend" aria-label="차트 범례">
          <span className="legend-sales">매출</span>
          <span className="legend-orders">주문 수</span>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="sales-trend-chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 8, bottom: 0, left: 4 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6da12f" stopOpacity={0.32} />
                  <stop offset="95%" stopColor="#6da12f" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e7eee1" strokeDasharray="4 4" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                minTickGap={24}
                tick={{ fill: "#777", fontSize: 12 }}
              />
              <YAxis
                yAxisId="sales"
                axisLine={false}
                tickLine={false}
                width={68}
                tick={{ fill: "#777", fontSize: 12 }}
                tickFormatter={(value) =>
                  value >= 10000
                    ? `${Math.round(value / 10000).toLocaleString()}만`
                    : value.toLocaleString()
                }
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                axisLine={false}
                tickLine={false}
                width={34}
                allowDecimals={false}
                tick={{ fill: "#8a8a8a", fontSize: 12 }}
              />
              <Tooltip
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullDate ?? ""
                }
                formatter={(value, name) => [
                  name === "매출"
                    ? `₩${Number(value).toLocaleString()}`
                    : `${Number(value).toLocaleString()}건`,
                  name,
                ]}
                contentStyle={{
                  border: "1px solid #d2e3bf",
                  borderRadius: "10px",
                  boxShadow: "0 5px 18px rgba(61, 91, 31, 0.12)",
                }}
              />
              <Area
                yAxisId="sales"
                type="monotone"
                dataKey="sales"
                name="매출"
                stroke="#6da12f"
                strokeWidth={3}
                fill="url(#salesGradient)"
              />
              <Line
                yAxisId="orders"
                type="monotone"
                dataKey="orders"
                name="주문 수"
                stroke="#5e5e5e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="sales-chart-empty">매출 데이터가 없습니다.</div>
      )}
    </div>
  );
}

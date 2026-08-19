export const getKoreaDateString = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
};

const getIsoWeekStringFromDateString = (dateString) => {
  const date = new Date(`${dateString}T00:00:00Z`);
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);

  const weekYear = date.getUTCFullYear();
  const yearStart = new Date(Date.UTC(weekYear, 0, 1));
  const week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);

  return `${weekYear}-W${String(week).padStart(2, "0")}`;
};

export const getKoreaWeekString = (date = new Date()) =>
  getIsoWeekStringFromDateString(getKoreaDateString(date));

export const getKoreaMonthString = (date = new Date()) =>
  getKoreaDateString(date).slice(0, 7);

export const isDateInPeriod = (dateTime, period, value) => {
  if (!value) return true;

  const dateString = String(dateTime ?? "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;

  if (period === "month") return dateString.startsWith(value);
  if (period === "week") {
    return getIsoWeekStringFromDateString(dateString) === value;
  }
  return dateString === value;
};

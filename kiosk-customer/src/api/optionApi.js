const API_BASE_URL = "http://localhost:8080";

// 전체 조회 (실제 백엔드 연동)
export const getOptions = async () => {
  const res = await fetch(`${API_BASE_URL}/api/options`);
  const data = await res.json();
  return data.data;
};

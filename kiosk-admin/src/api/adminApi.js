import api from "./axios";

export const login = async (username, password) => {
  const response = await api.post("/api/admin/login", {
    username,
    password,
  });

  return response.data;
};
import api from "./axios";
import { API_BASE_URL } from "../config/api";

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${API_BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
};

// 옵션 조회
export const getOptions = async () => {
  const response = await api.get("/api/admin/options");

  return response.data.data.map((option) => ({
    option_id: option.optionId,
    option_name: option.optionName,
    option_name_en: option.optionNameEn,
    category: option.optionCategory ?? option.category ?? "",
    option_price: option.optionPrice,
    option_image: getImageUrl(option.optionImage),
    option_is_available: option.optionIsAvailable,
    is_visible: option.isVisible,
  }));
};

// 옵션 등록
export const createOption = async (option, file) => {
  const formData = new FormData();

  const request = {
    optionName: option.option_name,
    optionNameEn: option.option_name_en,
    optionPrice: Number(option.option_price),
    optionIsAvailable: option.option_is_available,
  };

  formData.append("option", JSON.stringify(request));

  if (file) {
    formData.append("file", file);
  }

  const response = await api.post("/api/admin/options", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

// 옵션 수정
export const updateOption = async (optionId, option, file) => {
  const formData = new FormData();

  const request = {
    optionName: option.option_name,
    optionNameEn: option.option_name_en,
    optionPrice: Number(option.option_price),
    optionIsAvailable: option.option_is_available,
  };

  formData.append("option", JSON.stringify(request));

  if (file) {
    formData.append("file", file);
  }

  const response = await api.put(`/api/admin/options/${optionId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

// 옵션 판매중단
export const stopOption = async (optionId) => {
  const response = await api.patch(`/api/admin/options/${optionId}/stop`);

  return response.data.data;
};

// 옵션 판매재개
export const resumeOption = async (optionId) => {
  const response = await api.patch(`/api/admin/options/${optionId}/resume`);

  return response.data.data;
};

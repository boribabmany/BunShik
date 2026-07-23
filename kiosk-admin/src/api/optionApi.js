import api from "./axios";

// 옵션 조회
export const getOptions = async () => {
  const response = await api.get("/api/admin/options");

  return response.data.map((option) => ({
    option_id: option.optionId,
    option_name: option.optionName,
    option_price: option.optionPrice,
    option_image: option.optionImage,
    option_is_available: option.optionIsAvailable,
    status: option.status,
  }));
};

// 옵션 등록
export const createOption = async (option) => {
  const request = {
    optionName: option.option_name,
    optionPrice: option.option_price,
    optionImage: option.option_image,
    optionIsAvailable: option.option_is_available,
  };

  const response = await api.post("/api/admin/options", request);

  return response.data;
};

// 옵션 수정
export const updateOption = async (optionId, option) => {
  const request = {
    optionName: option.option_name,
    optionPrice: option.option_price,
    optionImage: option.option_image,
    optionIsAvailable: option.option_is_available,
  };

  const response = await api.put(
    `/api/admin/options/${optionId}`,
    request
  );

  return response.data;
};

// 옵션 삭제
export const deleteOption = async (optionId) => {
  const response = await api.delete(`/api/admin/options/${optionId}`);

  return response.data;
};
import api from "./axios";

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `http://localhost:8080${imageUrl}`;
};

// 옵션 조회
export const getOptions = async () => {
  const response = await api.get("/api/admin/options");

  return response.data.map((option) => ({
    option_id: option.optionId,
    option_name: option.optionName,
    option_price: option.optionPrice,
    option_image: getImageUrl(option.optionImage),
    option_is_available: option.optionIsAvailable,
    status: option.optionIsAvailable ? "판매중" : "품절",
  }));
};

// 옵션 등록
export const createOption = async (option, file) => {
  const formData = new FormData();

  const request = {
    optionName: option.option_name,
    optionPrice: Number(option.option_price),
    optionIsAvailable: option.option_is_available,
  };

  formData.append("option", JSON.stringify(request));

  if (file) {
    formData.append("file", file);
  }

  const response = await api.post(
    "/api/admin/options",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// 옵션 수정
export const updateOption = async (
  optionId,
  option,
  file
) => {
  const formData = new FormData();

  const request = {
    optionName: option.option_name,
    optionPrice: Number(option.option_price),
    optionIsAvailable: option.option_is_available,
  };

  formData.append("option", JSON.stringify(request));

  if (file) {
    formData.append("file", file);
  }

  const response = await api.put(
    `/api/admin/options/${optionId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// 옵션 삭제
export const deleteOption = async (optionId) => {
  const response = await api.delete(
    `/api/admin/options/${optionId}`
  );

  return response.data;
};
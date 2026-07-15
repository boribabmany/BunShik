//목업
import { options } from "../data/options";

let optionData = [...options];

// 전체 조회
export const getOptions = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...optionData]), 200);
  });
};

// 등록
export const createOption = async (option) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      optionData.push({
        ...option,
        option_id: Date.now(),
      });
      resolve();
    }, 200);
  });
};

// 수정
export const updateOption = async (option) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      optionData = optionData.map((o) =>
        o.option_id === option.option_id ? option : o
      );
      resolve();
    }, 200);
  });
};

// 삭제
export const deleteOption = async (optionId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      optionData = optionData.filter(
        (o) => o.option_id !== optionId
      );
      resolve();
    }, 200);
  });
};
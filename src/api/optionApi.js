import { options } from "../data/options";

let optionData = [...options];

// 전체 조회
export const getOptions = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...optionData]), 200);
  });
};

// optionApi.js 백엔드 완성시 위에 지우고 주석풀고 사용(실행 안 됨)

/*
 * TODO: 실제 백엔드 연동 시 getOptions()를 아래 코드로 교체
 *
 * const mapServerOptionToFrontend = (serverOption) => ({
 *   option_id: serverOption.id,
 *   option_name: serverOption.name,
 *   option_price: serverOption.price,
 *   option_is_available: serverOption.is_active,
 * });
 *
 * export const getOptions = async () => {
 *   const res = await fetch("/api/options");
 *   const data = await res.json();
 *   return data.map(mapServerOptionToFrontend);
 * };
 */

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
        o.option_id === option.option_id ? option : o,
      );
      resolve();
    }, 200);
  });
};

// 삭제
export const deleteOption = async (optionId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      optionData = optionData.filter((o) => o.option_id !== optionId);
      resolve();
    }, 200);
  });
};

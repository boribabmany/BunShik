import { create } from "zustand";
import {
  getOptions,
  createOption,
  updateOption,
  stopOption,
  resumeOption,
} from "../api/optionApi";

const useOptionStore = create((set) => ({
  optionList: [],

  // 옵션 조회
  loadOptions: async () => {
    const options = await getOptions();
    set({ optionList: options });
  },

  // 옵션 등록
  addOption: async (option, file) => {
    await createOption(option, file);

    const options = await getOptions();
    set({ optionList: options });
  },

  // 옵션 수정
  editOption: async (option, file) => {
    await updateOption(option.option_id, option, file);

    const options = await getOptions();
    set({ optionList: options });
  },

  // 옵션 판매중단
  stopOption: async (optionId) => {
    await stopOption(optionId);

    const options = await getOptions();
    set({ optionList: options });
  },

  // 옵션 판매재개
  resumeOption: async (optionId) => {
    await resumeOption(optionId);

    const options = await getOptions();
    set({ optionList: options });
  },
}));

export default useOptionStore;
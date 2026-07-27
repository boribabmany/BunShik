import { create } from "zustand";
import {
  getOptions,
  createOption,
  updateOption,
  deleteOption,
} from "../api/optionApi";

const useOptionStore = create((set) => ({
  optionList: [],

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
    await updateOption(
      option.option_id,
      option,
      file
    );

    const options = await getOptions();
    set({ optionList: options });
  },

  // 옵션 삭제
  removeOption: async (optionId) => {
    await deleteOption(optionId);

    const options = await getOptions();
    set({ optionList: options });
  },
}));

export default useOptionStore;

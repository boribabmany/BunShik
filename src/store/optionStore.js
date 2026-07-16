import { create } from "zustand";
import {getOptions, createOption, updateOption, deleteOption,} from "../api/optionApi";
import useHistoryStore from "./historyStore";

const useOptionStore = create((set) => ({
    optionList: [],

    loadOptions: async () => {
    const options = await getOptions();
    set({ optionList: options });
    },
    addOption: async (option) => {
    await createOption(option);
    const options = await getOptions();
    set({ optionList: options });
    useHistoryStore.getState().addHistory(
    "옵션 등록",
    `${option.option_name}이(가) 신규 등록되었습니다.`);
    },
    editOption: async (option) => {
    await updateOption(option);
    const options = await getOptions();
    set({ optionList: options });
    useHistoryStore.getState().addHistory(
    "옵션 수정",
    `${option.option_name}이(가) 수정되었습니다.`);
    },
    removeOption: async (optionId) => {
    await deleteOption(optionId);
    const options = await getOptions();
    set({ optionList: options });
    useHistoryStore.getState().addHistory(
    "옵션 삭제",
    `옵션(ID: ${optionId})이(가) 삭제되었습니다.`);},
}));

export default useOptionStore;
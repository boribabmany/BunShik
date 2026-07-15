import { create } from "zustand";
import {getOptions, createOption, updateOption, deleteOption,} from "../api/optionApi";

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
    },
    editOption: async (option) => {
    await updateOption(option);
    const options = await getOptions();
    set({ optionList: options });
    },
    removeOption: async (optionId) => {
    await deleteOption(optionId);
    const options = await getOptions();
    set({ optionList: options });},
}));

export default useOptionStore;
import { create } from "zustand";

const useLanguageStore = create((set) => ({
  language: "ko", // 'ko' | 'en'
  setLanguage: (lang) => set({ language: lang }),
}));

export default useLanguageStore;

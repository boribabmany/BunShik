import { create } from "zustand";

const useHistoryStore = create((set) => ({
  // 임시 데이터들
    histories: [
    {
        id: 1,
        title: "메뉴 등록",
        description: "참치김밥이 등록되었습니다.",
    },
    {
        id: 2,
        title: "가격 변경",
        description: "떡볶이 가격이 변경되었습니다.",
    },
    {
        id: 3,
        title: "품절 처리",
        description: "콜라가 품절 처리되었습니다.",
    },],

  // 새로운 변경 내역을 추가하는 액션
    addHistory: (title, description) => {
    set((state) => ({
        histories: [
        {
          id: Date.now(), // 고유 ID 생성
            title,
            description,
        },
        ...state.histories, // 최신 내역이 위로 오도록 앞에 추가
      ].slice(0, 5), // 최대 5개까지만 유지 (대시보드가 꽉 차지 않게)
    }));
},
}));

export default useHistoryStore;
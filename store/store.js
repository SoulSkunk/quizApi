import { create } from "zustand";

export const useStore = create((set) => ({
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));

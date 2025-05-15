import { create } from "zustand";
import { ICategory } from "@/types";

interface CategoryState {
  categories: ICategory[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  setCategories: (categories: ICategory[]) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,
  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
        method: "GET",
      });
      const data = await response.json();
      set({ categories: data.data });
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  setCategories: (categories) => set({ categories }),
}));
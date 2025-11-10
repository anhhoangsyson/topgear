import { create } from "zustand";
import { ICreateLaptop } from "@/types";

interface LaptopFormState {
  formData: Partial<ICreateLaptop>; // Dữ liệu của form
  setFormData: (data: Partial<ICreateLaptop>) => void;
  resetForm: () => void;
}

export const useLaptopStore = create<LaptopFormState>((set) => ({
  formData: {}, // Dữ liệu mặc định
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  resetForm: () => set({ formData: {} }),
}));
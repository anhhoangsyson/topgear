import { create } from "zustand";

interface LaptopFormState {
  formData: any; // Dữ liệu của form
  setFormData: (data: any) => void;
  resetForm: () => void;
}

export const useLaptopStore = create<LaptopFormState>((set) => ({
  formData: {}, // Dữ liệu mặc định
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  resetForm: () => set({ formData: {} }),
}));
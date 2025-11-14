import { create } from "zustand";
import { IVoucher } from "@/types";
import { voucherApi } from "@/services/voucher-api";

interface VoucherState {
  vouchers: IVoucher[];
  isLoading: boolean;
  error: string | null;
  fetchVouchers: () => Promise<void>;
  setVouchers: (vouchers: IVoucher[]) => void;
  addVoucher: (voucher: IVoucher) => void;
  updateVoucher: (id: string, voucher: IVoucher) => void;
  removeVoucher: (id: string) => void;
}

export const useVoucherStore = create<VoucherState>((set) => ({
  vouchers: [],
  isLoading: false,
  error: null,

  fetchVouchers: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await voucherApi.getAllVouchers();
      set({ vouchers: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch vouchers",
        isLoading: false
      });
    }
  },

  setVouchers: (vouchers) => set({ vouchers }),

  addVoucher: (voucher) =>
    set((state) => ({
      vouchers: [...state.vouchers, voucher]
    })),

  updateVoucher: (id, updatedVoucher) =>
    set((state) => ({
      vouchers: state.vouchers.map((v) =>
        v._id === id ? updatedVoucher : v
      ),
    })),

  removeVoucher: (id) =>
    set((state) => ({
      vouchers: state.vouchers.filter((v) => v._id !== id),
    })),
}));

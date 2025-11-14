import { TokenManager } from "@/lib/token-manager";
import { IVoucher, ICreateVoucher, IUpdateVoucher } from "@/types";

const BASE_URL = "/voucher";

export interface VoucherResponse {
  data: IVoucher;
}

export interface VouchersResponse {
  data: IVoucher[];
}

export const voucherApi = {
  // Get all vouchers
  async getAllVouchers(): Promise<IVoucher[]> {
    const response = await TokenManager.callWithAuth<VouchersResponse>(BASE_URL);
    return response.data;
  },

  // Get voucher by ID
  async getVoucherById(id: string): Promise<IVoucher> {
    const response = await TokenManager.callWithAuth<VoucherResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Create voucher
  async createVoucher(voucher: ICreateVoucher): Promise<IVoucher> {
    const response = await TokenManager.callWithAuth<VoucherResponse>(BASE_URL, {
      method: "POST",
      body: JSON.stringify(voucher),
    });
    return response.data;
  },

  // Update voucher
  async updateVoucher(id: string, voucher: IUpdateVoucher): Promise<IVoucher> {
    const response = await TokenManager.callWithAuth<VoucherResponse>(`${BASE_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(voucher),
    });
    return response.data;
  },

  // Delete voucher
  async deleteVoucher(id: string): Promise<IVoucher> {
    const response = await TokenManager.callWithAuth<VoucherResponse>(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    return response.data;
  },

  // Toggle voucher status
  async toggleVoucherStatus(id: string, status: 'active' | 'inactive'): Promise<IVoucher> {
    const response = await TokenManager.callWithAuth<VoucherResponse>(`${BASE_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return response.data;
  },
};

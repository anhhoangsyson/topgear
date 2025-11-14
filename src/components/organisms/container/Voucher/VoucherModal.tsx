import React from "react";
import { IVoucher } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/atoms/ui/Button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/atoms/ui/dialog";

interface VoucherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vouchers: IVoucher[];
  selectedVoucher: IVoucher | null;
  voucherCode: string;
  orderAmount: number; // Tổng giá trị đơn hàng
  onSelectVoucher: (voucher: IVoucher) => void;
  onInputVoucher: (code: string) => void;
  onClear: () => void;
  onConfirm: () => void;
}

export default function VoucherModal({
  open,
  onOpenChange,
  vouchers,
  selectedVoucher,
  voucherCode,
  orderAmount,
  onSelectVoucher,
  onInputVoucher,
  onClear,
}: VoucherModalProps) {

  // Hàm validate voucher trước khi apply
  const validateVoucher = (voucher: IVoucher): { isValid: boolean; message?: string } => {
    // Check status
    if (voucher.status !== 'active') {
      return {
        isValid: false,
        message: 'Voucher hiện không khả dụng'
      };
    }

    // Check hạn sử dụng
    if (new Date() > new Date(voucher.expiredDate)) {
      return {
        isValid: false,
        message: `Voucher đã hết hạn (HSD: ${new Date(voucher.expiredDate).toLocaleDateString('vi-VN')})`
      };
    }

    // Check số lượng sử dụng
    if (voucher.currentUsage >= voucher.maxUsage) {
      return {
        isValid: false,
        message: `Voucher đã hết lượt sử dụng (${voucher.currentUsage}/${voucher.maxUsage})`
      };
    }

    // Check giá đơn hàng tối thiểu (phải LỚN HƠN minPrice, không bằng)
    if (orderAmount <= voucher.minPrice) {
      const shortage = voucher.minPrice - orderAmount + 1; // +1 vì phải lớn hơn
      return {
        isValid: false,
        message: `Đơn hàng phải lớn hơn ${voucher.minPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}. Cần thêm ít nhất ${shortage.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`
      };
    }

    // Check nếu giá trị giảm cố định (priceOrigin) lớn hơn giá trị đơn hàng
    // Chỉ áp dụng khi priceOrigin > 0 (tức là giảm giá cố định, không phải %)
    if (voucher.priceOrigin > 0 && voucher.pricePercent === 0) {
      if (orderAmount < voucher.priceOrigin) {
        return {
          isValid: false,
          message: `Giá trị giảm giá ${voucher.priceOrigin.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} lớn hơn giá trị đơn hàng. Không thể áp dụng voucher này.`
        };
      }
    }

    return { isValid: true };
  };

  // Xử lý khi user chọn voucher từ list
  const handleSelectVoucher = (voucher: IVoucher) => {
    const validation = validateVoucher(voucher);

    if (!validation.isValid) {
      toast({
        title: "Không thể áp dụng voucher",
        description: validation.message,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    onSelectVoucher(voucher);
    toast({
      title: "Đã chọn voucher",
      description: `${voucher.code || 'Tự động'} - Giảm ${voucher.pricePercent > 0 ? `${voucher.pricePercent}%` : voucher.priceOrigin.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`,
      variant: "default",
      duration: 2000,
    });
  };

  // Xử lý khi user nhập code và click "Áp dụng"
  const handleCheckVoucher = async () => {
    if (!voucherCode.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập mã voucher',
        variant: 'destructive',
      });
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/voucher/customer/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: voucherCode,
          orderAmount: orderAmount
        }),
      });

      // Check response status
      if (!res.ok) {
        const errorData = await res.json();
        toast({
          title: "Không thể áp dụng voucher",
          description: errorData.message || "Vui lòng thử lại sau.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      const data = await res.json();
      const voucher = data.data || data; // Handle both response formats

      toast({
        title: "Áp dụng voucher thành công",
        description: `${voucher.code} đã được áp dụng`,
        variant: "default",
        duration: 3000,
      });

      onSelectVoucher(voucher);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Lỗi khi kiểm tra voucher:", error);
      }
      toast({
        title: "Lỗi",
        description: "Không thể kiểm tra voucher. Vui lòng thử lại sau.",
        variant: "destructive",
        duration: 3000,
      });
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chọn hoặc nhập mã khuyến mãi</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <div className="font-semibold mb-2">Voucher có sẵn</div>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {vouchers.length === 0 && (
                <div className="text-gray-400 text-sm">Không có voucher nào khả dụng</div>
              )}
              {vouchers.map((voucher) => {
                const validation = validateVoucher(voucher);
                const isDisabled = !validation.isValid;
                const isExpired = new Date() > new Date(voucher.expiredDate);
                const notEnoughMoney = orderAmount <= voucher.minPrice; // Phải LỚN HƠN minPrice
                const discountTooHigh = voucher.priceOrigin > 0 && voucher.pricePercent === 0 && orderAmount < voucher.priceOrigin;
                const outOfUsage = voucher.currentUsage >= voucher.maxUsage;

                return (
                  <label
                    key={voucher._id}
                    className={`flex items-center p-2 rounded border transition
                      ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
                      ${selectedVoucher?._id === voucher._id && !isDisabled ? "border-blue-500 bg-blue-50" : "border-gray-200"}
                      ${!isDisabled && selectedVoucher?._id !== voucher._id ? "hover:border-blue-300" : ""}`}
                  >
                    <input
                      type="radio"
                      className="mr-2 accent-blue-500"
                      checked={selectedVoucher?._id === voucher._id}
                      disabled={isDisabled}
                      onChange={() => handleSelectVoucher(voucher)}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {voucher.code || (voucher.type === "auto" ? "🎁 Tự động áp dụng" : "")}
                        {" - "}
                        {voucher.pricePercent > 0
                          ? `Giảm ${voucher.pricePercent}%`
                          : `Giảm ${voucher.priceOrigin?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`}
                      </div>

                      {/* Hiển thị điều kiện tối thiểu */}
                      {voucher.minPrice > 0 && (
                        <div className={`text-xs font-medium mt-1 ${notEnoughMoney ? 'text-orange-600' : 'text-gray-600'}`}>
                          Đơn tối thiểu: {voucher.minPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                        </div>
                      )}

                      {/* Warning nếu không đủ điều kiện minPrice */}
                      {notEnoughMoney && (
                        <div className="text-xs text-red-500 mt-1">
                          ⚠️ Cần thêm {(voucher.minPrice - orderAmount).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                        </div>
                      )}

                      {/* Warning nếu giá trị giảm lớn hơn đơn hàng */}
                      {discountTooHigh && !notEnoughMoney && (
                        <div className="text-xs text-red-500 mt-1">
                          ⚠️ Giá trị giảm lớn hơn đơn hàng
                        </div>
                      )}

                      {/* Hiển thị số lượng sử dụng */}
                      <div className={`text-xs mt-1 ${outOfUsage ? 'text-red-500' : 'text-gray-500'}`}>
                        {outOfUsage ? (
                          <>⚠️ Đã hết lượt ({voucher.currentUsage}/{voucher.maxUsage})</>
                        ) : (
                          <>Còn {voucher.maxUsage - voucher.currentUsage}/{voucher.maxUsage} lượt</>
                        )}
                      </div>

                      {/* Hiển thị trạng thái hết hạn */}
                      {isExpired && (
                        <div className="text-xs text-red-500 mt-1">
                          ⚠️ Đã hết hạn
                        </div>
                      )}

                      {/* Hiển thị HSD */}
                      {!isExpired && (
                        <div className="text-xs text-gray-400 mt-1">
                          HSD: {new Date(voucher.expiredDate).toLocaleDateString("vi-VN")}
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2">Hoặc nhập mã voucher</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={voucherCode}
                onChange={e => {
                  onInputVoucher(e.target.value);
                }}
                placeholder="Nhập mã voucher"
                className="flex-1 border rounded px-2 py-1 text-sm"
              />
              <Button
                type="button"
                onClick={handleCheckVoucher}
                variant="default"
              >
                Áp dụng
              </Button>
            </div>
          </div>
          {selectedVoucher && (
            <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm text-blue-700 flex items-center gap-2">
              <span>Đã chọn:</span>
              <span className="font-semibold">{selectedVoucher.code || "Tự động"}</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={onClear}
            variant="outline"
          >
            Bỏ chọn
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="default"
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
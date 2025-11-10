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
  onSelectVoucher,
  onInputVoucher,
  onClear,
}: VoucherModalProps) {

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
        body: JSON.stringify({ code: voucherCode }),
      })
      if (res.status === 400) {
        const errorData = await res.json();
        toast({
          title: "Lỗi",
          description: errorData.message || "Không thể kiểm tra voucher. Vui lòng thử lại sau.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      const data = await res.json();
      const voucher = data

      toast({
        title: "Kiểm tra voucher thành công",
        description: `Voucher ${voucher.code} đã được áp dụng`,
        variant: "default",
        duration: 3000,
      })

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
              {vouchers.map((voucher) => (
                <label
                  key={voucher._id}
                  className={`flex items-center p-2 rounded border cursor-pointer transition
      ${selectedVoucher?._id === voucher._id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
                >
                  <input
                    type="radio"
                    className="mr-2 accent-blue-500"
                    checked={selectedVoucher?._id === voucher._id}
                    onChange={() => {
                      onSelectVoucher(voucher);
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">
                      {voucher.code
                        ? voucher.code
                        : voucher.type === "auto"
                          ? "Tự động áp dụng"
                          : ""}
                      {" - "}
                      {voucher.pricePercent > 0
                        ? `Giảm ${voucher.pricePercent}%`
                        : `Giảm ${voucher.priceOrigin?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`}
                    </div>
                    <div className="text-xs text-gray-400">
                      HSD: {new Date(voucher.expiredDate).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </label>
              ))}
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
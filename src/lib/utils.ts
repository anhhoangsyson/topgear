import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function caculateSalePercent(price: number, priceSale: number) {
  const salePercent = (100 - (priceSale / price) * 100).toFixed(0) + "%";
  return salePercent;
}

export function formatPrice(price: string) {
  if (price == null || isNaN(Number(price))) return "0 ₫";

  return Number(price).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date
    .toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
    })
    .replace(",", ""); // Ví dụ: 15:56 12/04/2025
}

export function formatOrderStatus(status: string): string {
  switch (status) {
    case "pending":
      return "Đang chờ xử lý";
    case "payment_pending":
      return "Chưa thanh toán";
    case "payment_success":
      return "Đã thanh toán";
    case "payment_fail":
      return "Thanh toán thất bại";
    case "completed":
      return "Đã hoàn thành";
    case "cancelled":
      return "Đã hủy";
    case "payment_cancelling":
      return "Đang chờ hủy";
    default:
      return "Không xác định";
  }
}

export function formatPaymentMethod(method: string): string {
  switch (method) {
    case "cash":
      return "COD";
    case "zalopay":
      return "ZaloPay";
    default:
      return "Không xác định";
  }
}
export function formartLocation(
  pro: string,
  dis: string,
  ward: string,
  str: string
) {
  const location = `${str}, ${ward}, ${dis}, ${pro}`;
  return location;
}
export function formatLaptopName(name: string, specifications: any) {
  const { processor, ram, storage, graphicsCard } = specifications
  return `${name} ( ${processor} / ${ram} / ${storage} / ${graphicsCard})`
}

export const defaultAvatar= 'https://res.cloudinary.com/drsm6hdbe/image/upload/v1748352718/cxazajxw119cyay0ghhs.jpg'

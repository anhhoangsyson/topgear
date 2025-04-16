import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function caculateSalePercent(price: number, priceSale: number) {
  const salePercent = (100 - (priceSale / price * 100)).toFixed(0) + "%"
  return salePercent
}

export function formatPrice(price: any) {
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  })
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false,
  }).replace(',', ''); // Ví dụ: 15:56 12/04/2025
}

export function formatOrderStatus(status: string): string {
  switch (status) {
    case 'pending':
      return 'Đang chờ xử lý'
    case 'payment_pending':
      return 'Chưa thanh toán'
    case 'payment_success':
      return 'Đã thanh toán'
    case 'payment_fail':
      return 'Thanh toán thất bại'
    case 'completed':
      return 'Đã hoàn thành'
    case 'cancelled':
      return 'Đã hủy'
    default:
      return 'Không xác định'
  }
}
'use client';
import Cart from '@/app/(cli)/cart/ListCartProduct';
import React, { useEffect } from 'react';

// CartPage: trang giỏ hàng phía client
// - 'use client' vì sử dụng state & effect để fetch vouchers (client-only)
// - Voucher được lấy từ backend và truyền vào component `Cart` để hiển thị/áp dụng
export default function CartPage() {  
  const [vouchers, setVouchers] = React.useState([]);

  useEffect(() => {
    // Lấy các voucher có thể sử dụng cho khách hàng (client-side)
    // Lưu ý: không block render nếu endpoint lỗi
    const fetchVouchers = async () => {
      try {
        const voucherRes = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/voucher/customer/available`, {
          method: 'GET',
        })
        const data = await voucherRes.json();
        setVouchers(data.data)
      } catch (err) {
        // Silent fail: hiện tại chỉ log khi dev
        if (process.env.NODE_ENV === 'development') console.warn('[CartPage] fetch vouchers failed', err);
        setVouchers([]);
      }
    }
    fetchVouchers();
  }, [])

  return (
    <div className="">
      {/* Truyền vouchers xuống component Cart để hiển thị và áp dụng mã */}
      <Cart vouchers={vouchers} />
    </div>
  );
}
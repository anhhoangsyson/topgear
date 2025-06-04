'use client';
import Cart from '@/app/(client)/cart/ListCartProduct';
import React, { useEffect } from 'react';



export default function CartPage() {  
  const [vouchers, setVouchers] = React.useState([]);
  useEffect(() => {
    const fetchVouchers = async () => {
      const voucherRes = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/voucher/customer/available`, {
        method: 'GET',
      })
      const data = await voucherRes.json();
      setVouchers(data.data)
    }
    fetchVouchers();
  }, [])

  return (
    <div className="">
      <Cart vouchers={vouchers} />
    </div>
  );
}
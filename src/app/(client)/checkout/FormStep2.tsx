'use client';
import { RiCashLine } from "react-icons/ri";
import { SiZalo } from "react-icons/si";
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import useCartStore from "@/store/cartStore";
import { Toast } from "@radix-ui/react-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type PaymentMethod = 'cash' | 'zalopay';

interface CartItem {
  _id: string;
  variantName: string;
  variantPrice: number;
  variantPriceSale: number;
  quantity: number;
  image: string;
}

interface Step2Props {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    note: string;
  };
  selectedItems: CartItem[];
  onBack: () => void; // Callback function to go back to Step 1
}

export default function Step2({ customerInfo, selectedItems, onBack }: Step2Props) {
  const router = useRouter()
 
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>(''); // Lưu phương thức thanh toán
  const [voucherCode, setVoucherCode] = useState<string | null>(null); // Lưu mã giảm giá
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false); // Điều khiển modal

  const totalPrice = selectedItems.reduce((acc, item) => acc + (item.variantPriceSale * item.quantity), 0);
  const totalPriceFormatted = totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  const totalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast({
        title: 'Chưa chọn phương thức thanh toán',
        description: 'Vui lòng chọn phương thức thanh toán trước khi đặt hàng',
        duration: 3000,
        variant: 'destructive',
      })
      return;
    }
    if (selectedItems.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }


    const orderData = {
      address: customerInfo.address,
      paymentMethod: paymentMethod as PaymentMethod,
      voucherCode: voucherCode || null,
      cartItem: selectedItems.map(item => ({
        _id: item._id,
        variantName: item.variantName,
        variantPrice: item.variantPrice,
        variantPriceSale: item.variantPriceSale,
        quantity: item.quantity,
        image: item.image,
      })),
      note: customerInfo.note || '',
    };

    try {
      const accessToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
      const response = await fetch('https://top-gear-be.vercel.app/api/v1/order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        selectedItems.map((item) => { useCartStore.getState().removeFromCart(item._id) }); // Xóa sản phẩm đã chọn khỏi giỏ hàng

        const result = await response.json();

        if (paymentMethod === 'zalopay') {
          // Redirect đến urlPayment nếu là ZaloPay
          const paymentUrl = result.data.payment.paymentUrl;
          window.location.href = paymentUrl;
        } else {
          const orderId = result?.data?.data?._id;
          toast({
            title: 'Đặt hàng thành công',
            description: 'Cảm ơn bạn đã đặt hàng tại Top Gear!',
            duration: 3000,
            variant: 'default',
          })
          router.push(`/checkout/success/${orderId}`)
          
        }
      }
      else {
        const errorData = await response.json();
        toast({
          title: 'Đặt hàng thất bại',
          description: errorData.message || 'Có lỗi xảy ra trong quá trình đặt hàng',
          duration: 3000,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setShowPaymentModal(false); // Đóng modal sau khi chọn
  };

  return (
    <div className='h-screen'>
      {/* Giá */}
      <div className='w-full p-4 bg-white rounded'>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-sm font-thin text-gray-600'>Số lượng sản phẩm</p>
          <p className='text-gray-900 text-sm font-thin'>{totalQuantity}</p>
        </div>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-sm font-thin text-gray-600'>Tiền hàng (tạm tính)</p>
          <p className='text-gray-900 text-sm font-thin'>{totalPriceFormatted}</p>
        </div>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-sm font-thin text-gray-600'>Giảm giá</p>
          <p className='text-gray-900 text-sm font-thin'>0</p>
        </div>
        <div className='flex items-center justify-between border-t border-gray-300 my-2 pt-8'>
          <p className='text-sm font-thin text-gray-600'>
            <strong className='font-semibold text-black'>Tổng tiền </strong>(Đã gồm VAT)
          </p>
          <p className='text-black text-sm font-thin'>{totalPriceFormatted}</p>
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <h3 className='my-2 mt-8 uppercase'>Phương thức thanh toán</h3>
      <div className='w-full p-4 bg-white rounded'>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-sm font-thin text-gray-600'>Phương thức đã chọn</p>
          <p className='text-gray-900 text-sm font-thin'>
            {paymentMethod === 'cash' ? 'Thanh toán khi nhận hàng' : paymentMethod === 'zalopay' ? 'ZaloPay' : 'Chưa chọn'}
          </p>
        </div>
        <Button
          type='button'
          onClick={() => setShowPaymentModal(true)}
          variant='outline'
          className='mt-2'
        >
          Chọn phương thức thanh toán
        </Button>
      </div>

      {/* Modal chọn phương thức thanh toán */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chọn phương thức thanh toán</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Button
              onClick={() => handleSelectPaymentMethod('cash')}
              variant='outline'
              className='w-full'
            >
              <RiCashLine className='mr-2' />
              Thanh toán khi nhận hàng
            </Button>
            <Button
              onClick={() => handleSelectPaymentMethod('zalopay')}
              variant='outline'
              className='w-full'
            >
              <SiZalo className="mr-2" />
              Thanh toán qua ZaloPay

            </Button>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowPaymentModal(false)}
              variant='outline'
            >
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mã giảm giá */}
      {/* <h3 className='my-2 mt-8 uppercase'>Mã giảm giá</h3>
      <div className='w-full p-4 bg-white rounded'>
        <input
          type='text'
          value={voucherCode || ''}
          onChange={(e) => setVoucherCode(e.target.value)}
          placeholder='Nhập mã giảm giá (nếu có)'
          className='w-full p-1 border-b-2 border-b-gray-700 outline-none text-gray-800 text-sm font-thin focus-within:border-b-blue-500'
        />
      </div> */}

      {/* Thông tin nhận hàng */}
      <h3 className='my-2 mt-8 uppercase'>Thông tin nhận hàng</h3>
      <div className='w-full p-4 bg-white rounded'>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-sm font-thin text-gray-600'>Khách hàng</p>
          <p className='text-gray-900 text-sm font-thin'>{customerInfo.name}</p>
        </div>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-sm font-thin text-gray-600'>Số điện thoại</p>
          <p className='text-gray-900 text-sm font-thin'>{customerInfo.phone}</p>
        </div>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-sm font-thin text-gray-600'>Email</p>
          <p className='text-gray-900 text-sm font-thin'>{customerInfo.email || 'Không có'}</p>
        </div>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-sm font-thin text-gray-600'>Nhận hàng tại</p>
          <p className='text-gray-900 text-sm font-thin'>{customerInfo.address}</p>
        </div>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-sm font-thin text-gray-600'>Ghi chú</p>
          <p className='text-gray-900 text-sm font-thin'>{customerInfo.note || 'Không có'}</p>
        </div>

        {/* Danh sách sản phẩm */}
        {/* {selectedItems.map((item) => (
          <div key={item._id} className='grid grid-cols-5 p-4 rounded bg-gray-100 mb-2'>
            <div className='col-span-1 object-cover'>
              <img className='rounded' alt={item.variantName} height={100} width={100} src={item.image} />
            </div>
            <div className='col-span-3'>
              <p className='p-2 text-gray-700 text-sm text-wrap'>{item.variantName}</p>
              <p className='text-[15px] font-thin text-red-500'>
                {item.variantPriceSale.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </p>
            </div>
            <div className='col-span-1 flex items-center justify-center'>
              <p className='text-sm font-thin'>Số lượng: {item.quantity}</p>
            </div>
          </div>
        ))} */}
      </div>

      {/* Tổng tiền và nút thanh toán */}
      <div className='mx-auto p-3 fixed bottom-0 rounded-tl rounded-tr h-28 w-[600px] bg-white shadow-lg'>
        <div className='flex items-center justify-between mt-2'>
          <p className='text-sm font-semibold text-gray-900'>Tổng tiền:</p>
          <p className='text-sm font-semibold text-red-500'>{totalPriceFormatted}</p>
        </div>
        <Button
          onClick={handlePayment}
          variant={'destructive'}
          className='w-full mt-4 bg-red-500'
        >
          Thanh toán
        </Button>
      </div>
    </div>
  );
}
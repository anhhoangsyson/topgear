'use client';
import { RiCashLine } from "react-icons/ri";
import { SiZalo } from "react-icons/si";
import React, { useEffect, useState } from 'react';

import useCartStore, { CartItem } from "@/store/cartStore";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/atoms/ui/Button";
import VoucherModal from "@/components/organisms/container/Voucher/VoucherModal";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/atoms/ui/dialog";

type PaymentMethod = 'cash' | 'zalopay';


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
  const { data: session } = useSession();
  useEffect(() => {
    const fetchVouchers = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/voucher/customer/available`, {
        method: 'GET',
      });
      const data = await res.json();
      setVouchers(data.data);
    }
    fetchVouchers()
  }, [])

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>(''); // Lưu phương thức thanh toán
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false); // Điều khiển modal
  const [isLoading, setIsLoading] = useState<boolean>(false); // Điều khiển loading

  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [vouchers, setVouchers] = React.useState([]);// list voucher lấy từ be

  const setVoucher = useCartStore((state) => state.setVoucher);
  const selectedVoucher = useCartStore((state) => state.selectedVoucher);


  const totalPrice = selectedItems.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);
  const totalPriceFormatted = totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  const totalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);


  let discount = 0;
  if (selectedVoucher) {
    if (selectedVoucher.pricePercent > 0) {
      discount = Math.floor((totalPrice * selectedVoucher.pricePercent) / 100);
    } else if (selectedVoucher.priceOrigin > 0) {
      discount = Math.min(selectedVoucher.priceOrigin, totalPrice);
    }
  }
  const finalTotal = totalPrice - discount;
  const discountFormatted = discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  const finalTotalFormatted = finalTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const handlePayment = async () => {
    setIsLoading(true);
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

    // const orderData = {
    //   address: customerInfo.address,
    //   paymentMethod: paymentMethod as PaymentMethod,
    //   voucherCode: voucherCode || null,
    //   cartItem: selectedItems.map(item => ({
    //     _id: item._id,
    //     variantName: item.name,
    //     variantPrice: item.price,
    //     variantPriceSale: item.discountPrice,
    //     quantity: item.quantity,
    //     image: item.image,
    //   })),
    //   note: customerInfo.note || '',
    // };

    const orderData = {
      address: customerInfo.address,
      paymentMethod: paymentMethod as PaymentMethod,
      voucherCode: selectedVoucher?.code || null,
      voucherId: selectedVoucher?._id,// Lấy từ zustand, luôn đúng với voucher đang áp dụng
      cartItem: selectedItems.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        discountPrice: item.discountPrice,
        quantity: item.quantity,
        image: item.image,
      })),
      note: customerInfo.note || '',
    };


    try {
      const accessToken = session?.accessToken || ''; // Lấy accessToken từ session
      const response = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/order`, {
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
            description: 'Cảm ơn bạn đã đặt hàng tại E-COM!',
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
    finally {
      setIsLoading(false)
    }
  };

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setShowPaymentModal(false); // Đóng modal sau khi chọn
  };

  return (

    <div className="relative h-screen">
      {/* Hiển thị lớp overlay khi isLoading = true */}
      {isLoading && (
        <div className="fixed w-screen h-screen inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-60">
          <LoaderCircle className="animate-spin text-blue-500 w-12 h-12" />
        </div>
      )}
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
            <p className='text-gray-900 text-sm font-thin'>{discountFormatted}</p>
          </div>
          <div className='flex items-center justify-between border-t border-gray-300 my-2 pt-8'>
            <p className='text-sm font-thin text-gray-600'>
              <strong className='font-semibold text-black'>Tổng tiền </strong>(Đã gồm VAT)
            </p>
            <p className='text-black text-sm font-thin'>{finalTotalFormatted}</p>
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
        <div className="w-full p-4 bg-white rounded">
          <h3 className='my-2 mt-8 uppercase'>Mã giảm giá</h3>
          <Button
            onClick={() => { setShowVoucherModal(true) }}
            variant='outline'
          >
            Chọn hoặc nhập khuyến mãi
          </Button>
        </div>


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

        </div>

        {/* Tổng tiền và nút thanh toán */}
        <div className='mx-auto p-3 fixed bottom-0 rounded-tl rounded-tr h-28 w-[600px] bg-white shadow-lg'>
          <div className='flex items-center justify-between mt-2'>
            <p className='text-sm font-semibold text-gray-900'>Tổng tiền:</p>
            <p className='text-sm font-semibold text-red-500'>{finalTotalFormatted}</p>
          </div>
          <Button
            onClick={handlePayment}
            variant={'destructive'}
            className='w-full mt-4 bg-red-500'
          >
            Đặt hàng
          </Button>
        </div>

        {/* dialog chon voucher */}
        <VoucherModal
          open={showVoucherModal}
          onOpenChange={setShowVoucherModal}
          vouchers={vouchers} // truyền list voucher lấy từ BE
          selectedVoucher={selectedVoucher}
          voucherCode={selectedVoucher?.code || ""}
          onSelectVoucher={(voucher) => setVoucher(voucher)}
          onInputVoucher={(code) =>
            setVoucher({
              code,
              type: 'code',
              expiredDate: new Date(),
              pricePercent: 0,
              priceOrigin: 0,
              status: 'active'
            })} // hoặc logic phù hợp
          onClear={() => setVoucher(null)}
          onConfirm={() => setShowVoucherModal(false)}
        />
      </div>
    </div>
  );
}
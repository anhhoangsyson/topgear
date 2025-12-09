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

export default function Step2({ customerInfo, selectedItems }: Step2Props) {

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
      toast({
        title: 'Lỗi',
        description: 'Giỏ hàng trống! Vui lòng thêm sản phẩm vào giỏ hàng.',
        variant: 'destructive',
      });
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
      const accessToken = session?.accessToken || '';
      
      // Handle stock error messages from backend // Lấy accessToken từ session
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
        console.log('Full response from backend:', result);

        if (paymentMethod === 'zalopay') {
          // Redirect đến urlPayment nếu là ZaloPay
          const paymentUrl = result?.data?.payment?.paymentUrl || result?.data?.paymentUrl || result?.paymentUrl;
          console.log('Payment URL:', paymentUrl);

          if (!paymentUrl) {
            console.error('Payment URL not found in response:', result);
            toast({
              title: 'Lỗi thanh toán',
              description: 'Không tìm thấy URL thanh toán ZaloPay. Vui lòng thử lại.',
              duration: 3000,
              variant: 'destructive',
            });
            setIsLoading(false);
            return;
          }

          // Sử dụng window.location.assign thay vì href để đảm bảo redirect
          window.location.assign(paymentUrl);
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
        const errorMessage = errorData.message || 'Có lỗi xảy ra trong quá trình đặt hàng';
        console.log(errorMessage);
        
        // Check if error is related to stock
        const isStockError = errorMessage.includes('không đủ hàng') || 
                            errorMessage.includes('hết hàng') ||
                            errorMessage.includes('stock');
        
        toast({
          title: isStockError ? 'Không đủ hàng' : 'Đặt hàng thất bại',
          description: errorMessage,
          duration: isStockError ? 5000 : 3000,
          variant: 'destructive',
        });
        
        // If stock error, suggest refreshing cart
        if (isStockError) {
          // Optionally refresh product data or update cart
          // You can add logic here to refresh cart items
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error submitting order:', error);
      }
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

    <div className="relative min-h-screen pb-24 sm:pb-28 md:pb-32">
      {/* Hiển thị lớp overlay khi isLoading = true */}
      {isLoading && (
        <div className="fixed w-screen h-screen inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-60">
          <LoaderCircle className="animate-spin text-blue-500 w-12 h-12" />
        </div>
      )}
      <div className='min-h-screen'>
        {/* Giá */}
        <div className='w-full p-3 sm:p-4 bg-white rounded mb-3 sm:mb-4'>
          <div className='flex items-center justify-between mb-3 sm:mb-4'>
            <p className='text-xs sm:text-sm font-normal text-gray-600'>Số lượng sản phẩm</p>
            <p className='text-gray-900 text-xs sm:text-sm font-semibold'>{totalQuantity}</p>
          </div>
          <div className='flex items-center justify-between mb-3 sm:mb-4'>
            <p className='text-xs sm:text-sm font-normal text-gray-600'>Tiền hàng (tạm tính)</p>
            <p className='text-gray-900 text-xs sm:text-sm font-semibold break-words'>{totalPriceFormatted}</p>
          </div>
          <div className='flex items-center justify-between mb-3 sm:mb-4'>
            <p className='text-xs sm:text-sm font-normal text-gray-600'>Giảm giá</p>
            <p className='text-gray-900 text-xs sm:text-sm font-semibold break-words'>{discountFormatted}</p>
          </div>
          <div className='flex items-center justify-between border-t border-gray-300 my-2 pt-4 sm:pt-8'>
            <p className='text-xs sm:text-sm font-medium text-gray-700'>
              <strong className='font-bold text-black'>Tổng tiền </strong><span className='hidden sm:inline font-normal'>(Đã gồm VAT)</span>
            </p>
            <p className='text-black text-xs sm:text-sm font-bold break-words'>{finalTotalFormatted}</p>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <h3 className='my-2 mt-4 sm:mt-6 md:mt-8 uppercase text-sm sm:text-base'>Phương thức thanh toán</h3>
        <div className='w-full p-3 sm:p-4 bg-white rounded mb-3 sm:mb-4'>
          <div className='flex items-center justify-between mb-3 sm:mb-4'>
            <p className='text-xs sm:text-sm font-normal text-gray-600'>Phương thức đã chọn</p>
            <p className='text-gray-900 text-xs sm:text-sm font-semibold text-right break-words'>
              {paymentMethod === 'cash' ? 'Thanh toán khi nhận hàng' : paymentMethod === 'zalopay' ? 'ZaloPay' : 'Chưa chọn'}
            </p>
          </div>
          <Button
            type='button'
            onClick={() => setShowPaymentModal(true)}
            variant='outline'
            className='mt-2 w-full sm:w-auto text-xs sm:text-sm'
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
        <div className="w-full p-3 sm:p-4 bg-white rounded mb-3 sm:mb-4">
          <h3 className='my-2 mt-4 sm:mt-6 md:mt-8 uppercase text-sm sm:text-base mb-3 sm:mb-4'>Mã giảm giá</h3>
          <Button
            onClick={() => { setShowVoucherModal(true) }}
            variant='outline'
            className='w-full sm:w-auto text-xs sm:text-sm'
          >
            Chọn hoặc nhập khuyến mãi
          </Button>
        </div>


        {/* Thông tin nhận hàng */}
        <h3 className='my-2 mt-4 sm:mt-6 md:mt-8 uppercase text-sm sm:text-base'>Thông tin nhận hàng</h3>
        <div className='w-full p-3 sm:p-4 bg-white rounded mb-3 sm:mb-4'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-1 sm:gap-0'>
            <p className='text-xs sm:text-sm font-normal text-gray-600'>Khách hàng</p>
            <p className='text-gray-900 text-xs sm:text-sm font-medium break-words text-right sm:text-left'>{customerInfo.name}</p>
          </div>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-1 sm:gap-0'>
            <p className='text-xs sm:text-sm font-normal text-gray-600'>Số điện thoại</p>
            <p className='text-gray-900 text-xs sm:text-sm font-medium break-words text-right sm:text-left'>{customerInfo.phone}</p>
          </div>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-1 sm:gap-0'>
            <p className='text-xs sm:text-sm font-normal text-gray-600'>Email</p>
            <p className='text-gray-900 text-xs sm:text-sm font-medium break-words text-right sm:text-left'>{customerInfo.email || 'Không có'}</p>
          </div>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-1 sm:gap-0'>
            <p className='text-xs sm:text-sm font-normal text-gray-600'>Nhận hàng tại</p>
            <p className='text-gray-900 text-xs sm:text-sm font-medium break-words text-right sm:text-left'>{customerInfo.address}</p>
          </div>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-1 sm:gap-0'>
            <p className='text-xs sm:text-sm font-normal text-gray-600'>Ghi chú</p>
            <p className='text-gray-900 text-xs sm:text-sm font-medium break-words text-right sm:text-left'>{customerInfo.note || 'Không có'}</p>
          </div>

        </div>

        {/* Tổng tiền và nút thanh toán */}
        <div className='fixed bottom-0 left-0 right-0 sm:left-auto sm:right-auto sm:w-full sm:max-w-2xl mx-auto p-3 sm:p-4 rounded-tl-lg rounded-tr-lg sm:rounded-tl sm:rounded-tr h-auto sm:h-28 bg-white shadow-2xl border-t border-gray-200 z-[60]'>
          <div className='flex items-center justify-between mb-2 sm:mb-0 sm:mt-2'>
            <p className='text-xs sm:text-sm font-semibold text-gray-900'>Tổng tiền:</p>
            <p className='text-xs sm:text-sm font-semibold text-red-500 break-words'>{finalTotalFormatted}</p>
          </div>
          <Button
            onClick={handlePayment}
            variant={'destructive'}
            className='w-full mt-2 sm:mt-4 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-2'
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
          orderAmount={totalPrice} // Tổng giá trị đơn hàng để kiểm tra voucher
          onSelectVoucher={(voucher) => setVoucher(voucher)}
          onInputVoucher={(code) =>
            setVoucher({
              _id: '',
              code,
              type: 'code',
              expiredDate: new Date(),
              pricePercent: 0,
              priceOrigin: 0,
              minPrice: 0,
              maxUsage: 1,
              currentUsage: 0,
              maxDiscountAmount: 0,
              status: 'active',
              createdAt: new Date(),
              updatedAt: new Date(),
            })} // hoặc logic phù hợp
          onClear={() => setVoucher(null)}
          onConfirm={() => setShowVoucherModal(false)}
        />
      </div>
    </div>
  );
}
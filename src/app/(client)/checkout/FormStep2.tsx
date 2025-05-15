'use client';
import { RiCashLine } from "react-icons/ri";
import { SiZalo } from "react-icons/si";
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import useCartStore, { CartItem } from "@/store/cartStore";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

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

const getAccessToken = async () => {
  const res = await fetch('api/user/get-access-token', { method: 'GET' })

  if (!res.ok) {
    throw new Error('Failed to fetch access token')
  }

  return await res.json()
}
export default function Step2({ customerInfo, selectedItems, onBack }: Step2Props) {

  const router = useRouter()

  // fake voucher
  const vouchers = [
    {
      _id: "1",
      code: "TOPGEAR100K",
      type: "manual", // Nhập mã
      discountType: "amount",
      discountValue: 100000, // Giảm 100k
      minOrderValue: 1000000, // Đơn từ 1 triệu
      maxDiscount: null,
      expiredDate: "2025-12-31T23:59:59.000Z",
      usageLimit: 100,
      usedCount: 10,
      status: "active",
    },
    {
      _id: "2",
      code: "TOPGEAR10P",
      type: "manual", // Nhập mã
      discountType: "percent",
      discountValue: 10, // Giảm 10%
      minOrderValue: 2000000, // Đơn từ 2 triệu
      maxDiscount: 300000, // Tối đa giảm 300k
      expiredDate: "2025-12-31T23:59:59.000Z",
      usageLimit: 50,
      usedCount: 5,
      status: "active",
    },
    {
      _id: "3",
      code: null,
      type: "auto", // Tự động áp dụng
      discountType: "amount",
      discountValue: 300000, // Giảm 300k
      minOrderValue: 6000000, // Đơn từ 6 triệu
      maxDiscount: null,
      expiredDate: "2025-12-31T23:59:59.000Z",
      usageLimit: 0, // Không giới hạn
      usedCount: 0,
      status: "active",
    },
    {
      _id: "4",
      code: null,
      type: "auto", // Tự động áp dụng
      discountType: "percent",
      discountValue: 5, // Giảm 5%
      minOrderValue: 5000000, // Đơn từ 5 triệu
      maxDiscount: 200000, // Tối đa giảm 200k
      expiredDate: "2025-12-31T23:59:59.000Z",
      usageLimit: 0,
      usedCount: 0,
      status: "active",
    },
  ];

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>(''); // Lưu phương thức thanh toán
  const [voucherCode, setVoucherCode] = useState<string | null>(null); // Lưu mã giảm giá
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false); // Điều khiển modal
  const [showVoucherModal, setShowVoucherModal] = useState<boolean>(false); // Điều khiển modal mã giảm giá
  const totalPrice = selectedItems.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);
  const totalPriceFormatted = totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  const totalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const [isLoading, setIsLoading] = useState(false)

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
        variantName: item.name,
        variantPrice: item.price,
        variantPriceSale: item.discountPrice,
        quantity: item.quantity,
        image: item.image,
      })),
      note: customerInfo.note || '',
    };

    try {
      const { accessToken } = await getAccessToken()
      setIsLoading(true)
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
        <h3 className='my-2 mt-8 uppercase'>Mã giảm giá</h3>
        <Button
          onClick={() => { setShowVoucherModal(true) }}
          variant='outline'
        >
          Chọn hoặc nhập khuyến mãi
        </Button>
        <div className='w-full p-4 bg-white rounded'>
          <input
            type='text'
            disabled={true}
            value={voucherCode || ''}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder='Nhập mã giảm giá (nếu có)'
            className='w-full p-1 border-b-2 border-b-gray-700 outline-none text-gray-800 text-sm font-thin focus-within:border-b-blue-500'
          />
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

        {/* dialog chon voucher */}
        <Dialog open={showVoucherModal} onOpenChange={setShowVoucherModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chọn hoặc nhập mã voucher</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Danh sách voucher mẫu */}
              {vouchers.map((voucher) => (
                <Button
                  key={voucher._id}
                  variant={voucherCode === voucher.code ? "default" : "outline"}
                  className="w-full flex justify-between"
                  onClick={() => {
                    setVoucherCode(voucher.code);
                    setShowVoucherModal(false);
                  }}
                >
                  <span>
                    {voucher.code
                      ? `${voucher.code} - ${voucher.discountType === "amount"
                        ? `Giảm ${voucher.discountValue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`
                        : `Giảm ${voucher.discountValue}%`
                      }`
                      : voucher.discountType === "amount"
                        ? `Tự động: Giảm ${voucher.discountValue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`
                        : `Tự động: Giảm ${voucher.discountValue}%`
                    }
                  </span>
                  <span>
                    {voucher.minOrderValue > 0 && (
                      <span className="text-xs text-gray-500 ml-2">
                        Đơn từ {voucher.minOrderValue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      </span>
                    )}
                  </span>
                </Button>
              ))}

              {/* Nhập mã voucher thủ công */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucherCode || ""}
                  onChange={e => setVoucherCode(e.target.value)}
                  placeholder="Nhập mã voucher"
                  className="flex-1 border rounded px-2 py-1 text-sm"
                />
                <Button
                  type="button"
                  onClick={() => setShowVoucherModal(false)}
                  variant="default"
                >
                  Áp dụng
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setShowVoucherModal(false)}
                variant="outline"
              >
                Hủy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
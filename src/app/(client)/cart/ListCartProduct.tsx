'use client';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import useCartStore, { CartItem } from '@/store/cartStore';
import Image from 'next/image';
import { AiOutlineDelete } from "react-icons/ai";
import { IVoucher } from '@/types';
import { useSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/atoms/ui/Button';
import VoucherModal from '@/components/organisms/container/Voucher/VoucherModal';
const Cart = ({ vouchers }: { vouchers: IVoucher[] }) => {
    const { data: session } = useSession();
    const isProfileCompleted = session?.user?.profileCompleted || false;

    const router = useRouter();
    const { cartItems, toggleSelectItem, toggleSelectAll } = useCartStore();
    const [isHydrated, setIsHydrated] = useState<boolean>(false);
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [voucherCode, setVoucherCode] = useState("");
    const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(useCartStore((state) => state.selectedVoucher) || null);

    const removeFromCart = useCartStore((state) => state.removeFromCart);

    useEffect(() => { })

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) {
        return <div className="w-full grid grid-cols-12 my-8 gap-x-4">Đang tải...</div>;
    }

    // Kiểm tra xem tất cả sản phẩm có được chọn không
    const allSelected = cartItems.length > 0 && cartItems.every((item) => item.isSelected);
    const selectedItems = cartItems.filter((item) => item.isSelected);
    const total = selectedItems.reduce((sum, item) => sum + item.discountPrice * item.quantity, 0);

    let discount = 0;
    if (selectedVoucher) {
        if (selectedVoucher.pricePercent > 0) {
            discount = Math.floor((total * selectedVoucher.pricePercent) / 100);
        } else if (selectedVoucher.priceOrigin > 0) {
            discount = Math.min(selectedVoucher.priceOrigin, total);
        }
    }
    const finalTotal = total - discount;

    const handleBooking = () => {
        const selectedItems = cartItems.filter((item) => item.isSelected);

        // selectedItems.map((item) => {
        //     removeFromCart(item._id); // Xóa sản phẩm đã chọn khỏi giỏ hàng
        // })
        const encodedItems = encodeURIComponent(JSON.stringify(selectedItems));

        if (isProfileCompleted) router.push(`/checkout?cartItems=${encodedItems}`);

        else {
            toast({
                title: "Vui lòng cập nhật thông tin cá nhân",
                description: "Bạn cần cập nhật thông tin cá nhân để đặt hàng.",
                variant: "destructive",
                duration: 2000
            })
            router.push('/account')
        }

    }

    return (
        <div className="w-full grid grid-cols-12 my-8 gap-x-4">
            <div className="col-span-9 bg-white rounded p-4 px-4 border border-gray-300">
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <p className="text-lg font-semibold text-gray-500">Giỏ hàng của bạn đang trống.</p>
                    </div>
                ) : (
                    <>
                        {/* Header của grid con */}
                        <div className="grid grid-cols-9 pb-4 pl-4">
                            <div className="col-span-5 font-bold text-base">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={(e) => toggleSelectAll(e.target.checked)}
                                    />
                                    Sản phẩm
                                </label>
                            </div>
                            <div className="col-span-1 font-semibold text-base text-center">Đơn giá</div>
                            <div className="col-span-1 font-semibold text-base text-center">Số lượng</div>
                            <div className="col-span-1 font-semibold text-base text-center">Thành tiền</div>
                            <div className="col-span-1 font-semibold text-base text-center"></div>
                        </div>

                        {/* Danh sách cartItems */}
                        {cartItems.map((item: CartItem) => (
                            <div key={item._id} className="col-span-9 max-h-[113px] grid grid-cols-9 border-t p-4">
                                <div className="col-span-5 font-bold text-[15px] truncate pr-2 text-wrap">
                                    <div className="flex items-center justify-start align-middle gap-4">
                                        <input
                                            type="checkbox"
                                            checked={item.isSelected}
                                            onChange={() => toggleSelectItem(item._id)}
                                        />
                                        <div className="flex items-center justify-center w-20 h-20 rounded border border-gray-300">
                                            <Image alt={item.image} width={40} height={40} src={item.image} />
                                        </div>
                                        <p className="">{item.name}</p>
                                    </div>
                                </div>
                                <div className="col-span-1 flex flex-col justify-center items-center text-base text-center">
                                    <p className="font-semibold text-base text-gray-700 text-nowrap">
                                        {item.discountPrice!.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                    </p>
                                    {item.discountPrice !== item.price && (
                                        <p className="text-gray-500 line-through">
                                            {item.price.toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })}
                                        </p>
                                    )}
                                </div>
                                <div className="col-span-1 flex items-center justify-center text-base">
                                    <p className="text-center text-nowrap">{item.quantity}</p>
                                </div>
                                <div className="col-span-1 flex items-center text-base text-center text-red-500 font-semibold">
                                    {(item.discountPrice * item.quantity).toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </div>
                                <div
                                    className='col-span-1 flex items-center justify-end text-base text-center font-semibold'
                                >
                                    <Button
                                        onClick={() => removeFromCart(item._id)}
                                        variant={'outline'}>
                                        <AiOutlineDelete />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
            {/* right column */}
            <div className="col-span-3 rounded">
                <div className='flex justify-between items-center bg-white p-4 rounded border border-gray-300'>
                    <p className='font-semibold text-base'>Khuyến mãi</p>
                    <Button
                        variant={'link'}
                        className='text-blue-500 p-0'
                        onClick={() => setShowVoucherModal(true)}
                    >
                        Chọn mã khuyến mãi
                    </Button>
                </div>
                <div className="bg-white rounded p-4 border border-gray-300 mt-4">
                    <h3 className="font-bold text-base">Thanh toán</h3>
                    <div className='flex justify-between items-center mt-2'>
                        <p className='font-medium text-sm'>Tổng tạm tính</p>
                        <p>
                            {cartItems
                                .filter((item) => item.isSelected) // Chỉ tính sản phẩm được chọn
                                .reduce((total: number, item: CartItem) => total + item.discountPrice * item.quantity, 0)
                                .toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </p>
                    </div>
                    <div className='flex justify-between items-center mt-2'>
                        <p className='font-medium text-sm'>Giảm giá</p>
                        <p>
                            {discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </p>
                    </div>
                    <div className='flex justify-between items-center mt-2'>
                        <p className='font-medium text-sm'>Thành tiền</p>
                        <p>
                            {finalTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </p>
                    </div>
                    <div className='w-full'>
                        <Button
                            disabled={cartItems.filter((item) => item.isSelected).length === 0}
                            className='w-full mt-4 bg-blue-500 text-white'
                            variant={'outline'}
                            onClick={handleBooking}
                        >
                            Đặt hàng
                        </Button>
                    </div>
                </div>
            </div>

            {/* voucher modal */}
            <VoucherModal
                open={showVoucherModal}
                onOpenChange={setShowVoucherModal}
                vouchers={vouchers}
                selectedVoucher={selectedVoucher}
                voucherCode={voucherCode}
                onSelectVoucher={(voucher) => {
                    setSelectedVoucher(voucher);
                    // setVoucher
                    useCartStore.getState().setVoucher(voucher);

                    setVoucherCode(voucher.code || "");
                }}
                onInputVoucher={(code) => {
                    setVoucherCode(code);
                    setSelectedVoucher(null);
                }}
                onClear={() => {
                    setVoucherCode("");
                    setSelectedVoucher(null);
                }}
                onConfirm={() => {
                    // Validate hoặc lưu voucher vào zustand ở đây nếu cần
                    // useCartStore.getState().setVoucher(selectedVoucher);
                    setShowVoucherModal(false);
                }}
            />
        </div>
    );
};

export default Cart;
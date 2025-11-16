'use client'
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Step1 from '@/app/(cli)/checkout/FormStep1'
import Step2 from '@/app/(cli)/checkout/FormStep2'
import { CartItem } from '@/store/cartStore'

export default function CheckoutClient() {
    const searchParams = useSearchParams();

    const [currentStep, setCurrentStep] = useState(1)
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        note: "",
    })

    const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
    useEffect(() => {
        const items = searchParams.get("cartItems");
        if (items) {
            try {
                // Giải mã và parse chuỗi JSON từ query string
                const decodedItems = JSON.parse(decodeURIComponent(items));
                setSelectedItems(decodedItems);

            } catch (error) {
                console.error("Error parsing cartItems:", error);
                setSelectedItems([]);
            }
        }
    }, [searchParams]);


    const handleStep1Submit = (data: {
        fullName: string;
        phone: string;
        email?: string;
        shippingAddress: { province: string; district: string; ward: string; street: string };
        note?: string;
    }) => {

        const formattedAddress = `${data.shippingAddress.street}, ${data.shippingAddress.ward}, ${data.shippingAddress.district}, ${data.shippingAddress.province}`;
        setCustomerInfo({
            name: data.fullName,
            email: data.email || "",
            phone: data.phone,
            address: formattedAddress,
            note: data.note || "",
        });
        if (currentStep === 1) {
            setCurrentStep(2); // Chuyển sang bước 2 nếu đang ở bước 1
        }
    };
    const handleBackToStep1 = () => {
        setCurrentStep(1); // Quay lại bước 1
    }
    return (
        <div className='w-full max-w-2xl mx-auto min-h-screen px-4 sm:px-6 md:px-8 mt-4 sm:mt-6 md:mt-8 pb-24 sm:pb-28 md:pb-32'>
            {/* Header     */}
            <div className='grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6'>
                <div
                    onClick={handleBackToStep1}
                    className={`col-span-1 text-center hover:cursor-pointer transition-colors duration-200 text-xs sm:text-sm md:text-base py-2 ${currentStep === 1 ? 'text-blue-500 border-b-4 border-b-blue-500' : 'border-b-4 border-b-gray-300'}`}>1. Thông tin</div>
                <div className={`col-span-1 text-center hover:cursor-pointer transition-colors duration-200 text-xs sm:text-sm md:text-base py-2 ${currentStep === 2 ? 'text-blue-500 border-b-4 border-b-blue-500' : 'border-b-4 border-b-gray-300'}`}>2. Thanh toán</div>
            </div>

            {/* form step 1 */}
            {currentStep === 1 && (
                <Step1
                    selectedItems={selectedItems}
                    onSubmitStep1={handleStep1Submit}
                    initialCustomerInfo={customerInfo}
                // shippingInfo={customerInfo}
                />
            )}

            {/* form step 2 */}
            {currentStep === 2 && (
                <Step2
                    customerInfo={customerInfo}
                    selectedItems={selectedItems}
                    onBack={handleBackToStep1}
                />
            )}
        </div>
    )
}

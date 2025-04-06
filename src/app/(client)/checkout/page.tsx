'use client'
// import { useRouter } from 'next/router'
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import Step1 from '@/app/(client)/checkout/FormStep1'
import Step2 from '@/app/(client)/checkout/FormStep2'

export default function CheckoutPage() {
    const searchParams = useSearchParams();

    const [currentStep, setCurrentStep] = useState(1)
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    })
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    useEffect(() => {
        const items = searchParams.get("cartItems");
        if (items) {
            try {
                // Giải mã và parse chuỗi JSON từ query string
                const decodedItems = JSON.parse(decodeURIComponent(items));
                setSelectedItems(decodedItems);
                console.log("Selected items:", decodedItems);

            } catch (error) {
                console.error("Error parsing cartItems:", error);
                setSelectedItems([]);
            }
        }
    }, [searchParams]);

    return (
        <div className='w-[600px] h-screen  mx-auto '>
            {/* Header     */}
            <div className='grid grid-cols-2 gap-4 mb-6'>
                <div className={`col-span-1 text-center ${currentStep === 1 ? 'text-blue-500 border-b-4 border-b-blue-500' : 'border-b-4 border-b-gray-300'}`}>1. Thông tin</div>
                <div className={`col-span-1 text-center ${currentStep === 2 ? 'text-blue-500 border-b-4 border-b-blue-500' : 'border-b-4 border-b-gray-300'}`}>2. Thanh toán</div>
            </div>

            {/* form step 1 */}
            {currentStep === 1 && (
                <Step1
                    selectedItems={selectedItems}
                />
            )}

            {/* form step 2 */}
            {currentStep === 2 && (
                <Step2 />
            )}
        </div>
    )
}

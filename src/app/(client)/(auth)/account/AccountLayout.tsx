'use client'
import React, { useEffect, useState } from 'react'

import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineLocalShipping } from "react-icons/md";
import { CiMap } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";


import { useRouter, useSearchParams } from 'next/navigation';
import AccountInfo from '@/app/(client)/(auth)/account/AccountInfo';
import Orders from '@/app/(client)/(auth)/account/Order';
import Addresses from '@/app/(client)/(auth)/account/Adrress';
import Notifications from '@/app/(client)/(auth)/account/Notification';

export default function AccountLayout() {

    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeComponent, setActiveComponent] = useState('AccountInfo');

    useEffect   (() => {
        const component = searchParams.get('component');
        if (component) {
            setActiveComponent(component);
        }
    }, [searchParams]);

    const handleComponentChange = (component: string) => {
        setActiveComponent(component);
        router.push(`?component=${component}`);
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'AccountInfo':
                return <AccountInfo />;
            case 'Orders':
                return <Orders />;
            case 'Addresses':
                return <Addresses />;
            case 'Notifications':
                return <Notifications />;
            default:
                return <AccountInfo />;
        }
    }

    const menuAccount = [
        {
            icon: <FaRegUserCircle className='w-4 h-auto' />,
            subTitle: 'Thông tin tài khoản',
            label: 'AccountInfo'
        },
        {
            icon: <MdOutlineLocalShipping className='w-4 h-auto' />,
            subTitle: 'Đơn hàng của tôi',
            label: 'Orders'
        },
        {
            icon: <CiMap className='w-4 h-auto' />,
            subTitle: 'Địa chỉ của tôi',
            label: 'Addresses'
        },
        {
            icon: <IoIosNotificationsOutline className='w-4 h-auto' />,
            subTitle: 'Thông báo của tôi',
            label: 'Notifications'
        }
    ]

    return (
        <>
            <div className="flex mx-auto pt-8 pb-10 2xl:w-[1200px]  bg-[#f8f8fc] rounded">
                <div className='grid grid-cols-4 gap-x-4 w-full'>
                    <div className='col-span-1 w-full'>
                        {/* Header of MenuBar */}
                        <div className='flex items-center gap-x-4'>
                            <div>
                                <FaRegUserCircle
                                    className='w-6 h-auto' />
                            </div>
                            <div>
                                <p className='w-full font-light text-xs'>Tài khoản của</p>
                                <p className='w-full font-semibold  text-base'>Anh Hoang</p>
                            </div>
                        </div>
                        {/* MenuBar */}
                        <div className='mt-2'>
                            {menuAccount.map((item, index) => (
                                <div
                                    onClick={() => { handleComponentChange(item.label) }}
                                    key={index}
                                    className='flex mb-3 cursor-pointer'>
                                    <div className='flex items-center gap-x-3' >
                                        {item.icon}
                                        <p className='font-medium text-sm uppercase'>{item.subTitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='col-span-3'>
                        <div className=''>
                            {renderComponent()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

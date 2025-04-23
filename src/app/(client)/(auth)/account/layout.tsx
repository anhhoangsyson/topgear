'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { CiMap } from 'react-icons/ci'
import { FaRegUserCircle } from 'react-icons/fa'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { MdOutlineLocalShipping } from 'react-icons/md'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    
    const pathname = usePathname();
    
    const isActive = (label: string) => {
        return pathname === `/account/${label}` || (label === 'info' && pathname === '/account');
      };

    const menuAccount = [
        {
            icon: <FaRegUserCircle className='w-4 h-auto' />,
            subTitle: 'Thông tin',
            label: 'info'
        },
        {
            icon: <MdOutlineLocalShipping className='w-4 h-auto' />,
            subTitle: 'Đơn hàng',
            label: 'orders'
        },
        {
            icon: <CiMap className='w-4 h-auto' />,
            subTitle: 'Địa chỉ',
            label: 'address'
        },
        {
            icon: <IoIosNotificationsOutline className='w-4 h-auto' />,
            subTitle: 'Thông báo',
            label: 'notification'
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
                                <Link
                                    key={index}
                                    href={'/account/' + item.label}>
                                    <div
                                        className={`flex cursor-pointer p-2 rounded
                                        ${isActive(item.label)? ' bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-200'}
                                        `}>
                                        <div className='flex items-center gap-x-3' >
                                            {item.icon}
                                            <p className='font-medium text-[13px] uppercase'>{item.subTitle}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className='col-span-3'>
                            {children}
                    </div>
                </div>
            </div>
        </>
    )
}

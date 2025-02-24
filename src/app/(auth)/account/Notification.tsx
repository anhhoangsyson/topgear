import Image from 'next/image'
import React from 'react'

import imgQuat from '../../../../public/imgquat.png'

export default function Notifications() {
  return (
    <>
      <p className='text-xl font-bold'>Thông báo của bạn</p>
      <div className='w-full p-4 bg-white'>
        <div className='flex items-center w-full p-4 bg-white rounded hover:bg-[#f8f8fc] hover:shadow-md shadow-transparent transition-shadow duration-300 cursor-pointer'>
          {/* body of notification */}
          <div className='flex items-center justify-start w-full gap-x-4'>
            {/* img, avt ... */}
            <div className='w-[50px] h-[50px] rounded-full border-gray-300'>
              <Image
                alt='avt'
                width={50}
                height={40}
                className='rounded-full border-gray-300'
                src={imgQuat}
              ></Image>
            </div>
            <div>
              <p className='text-sm font-semibold'>Đặt hàng thành công</p>
              <p className='mt-2 text-sm font-light truncate text-nowrap'>Đơn hàng 25021439643330 đã xác nhận thanh toán COD</p>
            </div>
            <div>
            </div>
            {/* message */}
            <div></div>
          </div>
          {/* time notification */}
          <div className='text-nowrap text-xs text-gray-400'>
            2 gio truoc
          </div>
        </div>
      </div>
    </>
  )
}

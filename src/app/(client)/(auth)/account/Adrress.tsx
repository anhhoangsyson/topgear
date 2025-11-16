import { Button } from '@/components/atoms/ui/Button'
import React from 'react'

export default function Addresses() {
  return (
    <div className='w-full p-4'>
      {/* Title */}
      <p className='font-bold text-xl'>Địa chỉ</p>
      {/* add new address */}
      <div className='flex justify-center items-center mt-4 w-full h-[68px] bg-white text-sm font-light border-dashed border-gray-400 border-2 rounded cursor-pointer'>
        Thêm địa chỉ mới
      </div>
      {/* address */}
      <div
        className='flex items-center justify-between mt-8 2xl:w-full p-4 bg-white rounded'>
        <div className=''>
          {/* name address */}
          <div className='flex items-center gap-x-4'>
            <p className='font-bold text-base '>Anh Hoang</p>
            <Button
              variant='outline'
              // default address will be disabled
              disabled
              className='h-6 border-red-500 text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white'>
              Mặc định
            </Button>
          </div>
          <p
            className='font-light text-xs mt-4'>
            Địa chỉ: 449/12 Trường Chinh, Phường Tân Thới Hiệp, Quận 12, Thành phố Hồ Chí Minh</p>
          <p
            className='font-light text-xs mt-4'>
            Số điện thoại: 0123456789</p>
        </div>
        <div>
          <Button
            variant='outline'
            className='border-red-500 text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white'>
            Chỉnh sửa
          </Button>
        </div>
      </div>
    </div>
  )
}

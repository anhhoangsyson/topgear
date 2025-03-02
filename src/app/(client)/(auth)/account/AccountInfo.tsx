import FormAccountInfo from '@/app/(client)/(auth)/account/ui/FormAccountInfo'
import React from 'react'

export default function AccountInfo() {
  return (
    <div className='flex gap-x-4'>
      <div className='bg-white rounded w-4/5'>
        <FormAccountInfo />
      </div>
      <div className='p-4 w-1/5 2xl:min-w-[227px] bg-white rounded'>
        <p className='text-xl font-bold'>Địa chỉ mặc định</p>
        <div className='mt-4'>
          <p className='font-medium text-xs'>Tỉnh/ Thành phố</p>
          <div className='flex items-center mt-2 pl-4 h-9  text-xs font-light bg-[#F6F6F6] rounded'>Thành phố Hồ Chí Minh</div>
        </div>
        <div className='mt-4'>
          <p className='font-medium text-xs'>Quận/ Huyện</p>
          <div className='flex items-center mt-2 pl-4 h-9  text-xs font-light bg-[#F6F6F6] rounded'>Quận 12</div>
        </div>
        <div className='mt-4'>
          <p className='font-medium text-xs'>Phường/ Xã</p>
          <div className='flex items-center mt-2 pl-4 h-9  text-xs font-light bg-[#F6F6F6] rounded'>Tân Thới Hiệp</div>
        </div>
        <div className='mt-4'>
          <p className='font-medium text-xs'>Địa chỉ cụ thể</p>
          <div className='flex items-center mt-2 pl-4 h-9  text-xs font-light bg-[#F6F6F6] rounded'>449/12 Trường Chinh</div>
        </div>
      </div>
    </div>
  )
}

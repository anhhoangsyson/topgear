import React from 'react'
import { CiLocationOn, CiPhone, CiStickyNote, CiUser } from 'react-icons/ci'

export default function CustomerInfoOrder({ customerInfo, note }: { customerInfo: any, note: string }) {
  
  return (
    <div className='mb-4 p-4 bg-white rounded'>
      <p
        className='font-semibold mb-4 '
      >Thông tin người nhận</p>
      <div className='py-2 flex gap-x-4 items-center text-gray-700 text-base'>
        <CiUser className='text-gray-500' />
        {customerInfo.fullname}
      </div>
      <div className='py-2 flex gap-x-4 items-center text-gray-700 text-base'>
        <CiPhone className='text-gray-500' />
        <p>{customerInfo.phone}</p>
      </div>
      <div className='py-2 flex gap-x-4 items-center text-gray-700 text-base'>
        <CiLocationOn className='text-gray-500' />
        {customerInfo.address}
      </div>

      <div className='py-2 flex gap-x-4 items-center text-gray-700 text-base'>
        <CiStickyNote className='text-gray-500' />
        {note ? note : "khong co ghi chu"}</div>
    </div>
  )
}

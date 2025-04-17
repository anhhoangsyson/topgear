import React from 'react'
import FormAccountInfo from '../ui/FormAccountInfo';
import AddressInfo from '@/app/(client)/(auth)/account/info/AddressInfo';

export default function page() {
  return (
    <div className='flex gap-x-4'>
      <div className='bg-white rounded w-4/6'>
        <FormAccountInfo />
      </div>
      <AddressInfo />
    </div>
  )
}

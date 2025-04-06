import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from "zod"
export default function Step1({ selectedItems }: {
  selectedItems: {
    _id: string;
    variantName: string;
    variantPrice: number;
    variantPriceSale: number;
    quantity: number;
    image: string;
  }[]
}) {

  const [customerInfo, setCustomerInfo] = useState({})

  useEffect(() => {
    // call api to get customer info
  })

  const formSchema = z.object({
    fullName: z.string().min(1, { message: "Tên không được để trống" }),
    phone: z.string().min(1, { message: "Số điện thoại không được để trống" }).regex(/^[0-9]+$/, { message: "Số điện thoại không hợp lệ" }),
    email: z.string().email({ message: "Email không hợp lệ" }).optional(),
    province: z.string().min(1, { message: "Tỉnh thành không được để trống" }),
    district: z.string().min(1, { message: "Quận huyện không được để trống" }),
    ward: z.string().min(1, { message: "Phường xã không được để trống" }),
    street: z.string().min(1, { message: "Địa chỉ không được để trống" }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      province: "",
      district: "",
      ward: "",
      street: "",
    },
  })

  return (
    <div className='h-screen '>
      {/* info san pham */}
      {selectedItems.map((item) => (
        <div
          key={item._id}
          className='grid grid-cols-5 p-4 rounded bg-white pb-4'>
          <div className='col-span-1 object-cover'>
            <Image
              className='rounded'
              alt={item.variantName}
              height={100}
              width={100}
              src={item.image} />
          </div>
          <div className='col-span-3'>
            <p className='p-2 text-gray-700 text-sm text-wrap '>{item.variantName}</p>
            <div className='flex px-2'>
              <p className='text-[15px] font-thin text-red-500'>
                {item.variantPriceSale.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
                <span>
                  {item.variantPriceSale !== item.variantPrice && (
                    <span className='text-gray-400 line-through ml-2'>{item.variantPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}</span>
                  )}
                </span>
              </p>
            </div>
          </div>
          <div className='col-span-1 flex items-center justify-center'>
            <p className='text-sm font-thin text-center'>Số lượng: <span className='text-red-500 font-thin text-sm'>{item.quantity}</span></p>
          </div>
        </div>
      ))}

      {/* thong tin khach hang */}
      <h3 className='my-2 mt-8 uppercase'>Thông tin khách hàng</h3>
      <div className='w-full p-4 bg-white rounded'>
        <div className='flex items-center justify-between gap-x-4 mb-4'>
          <p className='text-gray-700 text-sm font-thin'>Hoàng Sỹ Sơn Anh</p>
          <p className='text-gray-400 text-xs font-thin'>0346122228</p>
        </div>
        <form action="">
          <label
            className='block text-xs font-thin text-gray-400'
            htmlFor="email">
            EMAIL
          </label>
          <input
            className='w-full p-1 border-b-2 border-b-gray-700 outline-none text-gray-800 text-sm font-thin focus-within:border-b-blue-500'
            id='email' type="text"
            value={'sonanhdeptraitop1thegioi@gmail.com'} />

          <p
            className='my-4 text-[11px] font-thin text-gray-400'
          >
            (*) Hóa đơn VAT sẽ được gửi qua email này
          </p>
        </form>


      </div>
    </div>
  )
}

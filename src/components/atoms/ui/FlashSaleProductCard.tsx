import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import productsale1 from '../../../public/productsale1.png'
export default function FlashSaleProductCard({ data }: { data: any }) {
    return (
        <div className='w-[194px] h-72'>
            <Link
                href={`/product/${data.slug}`}
            >
                <div className='w-full h-36 cursor-pointer'>
                    <div className='w-full h-auto mx-auto object-cover'>
                        <Image
                        className='w-full h-auto mx-auto object-cover'
                            src={productsale1}
                            alt='product'
                        ></Image>
                    </div>
                    <div className='w-full h-.5 border-b-2 border-l-2 border-r-2 border-[#F96262]'>
                        <p className='px-3 p-2 font-bold text-red-400 text-base text-center ext-ellipsis'>Máy chơi Game cầm tay</p>
                    </div>
                </div>
            </Link>
            <div className='pt-4'>
                <div className=''>
                    <p className='block w-full h-8 rounded-full bg-[#F96262] text-center text-white text-sm'>Đã bán 0/5</p>
                </div>
            </div>
        </div>
    )
}

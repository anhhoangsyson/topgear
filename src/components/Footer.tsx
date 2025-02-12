import Link from 'next/link'
import React from 'react'
// import uytin from '../../../public/uytin.png'
import Image from 'next/image'
export default function Footer() {
    return (
        <footer className='w-11/12 mx-auto pt-24'>
            
            <div className='pt-24 grid grid-cols-3 gap-3'>
                <div>
                    <p className='text-2xl font-bold'>Đăng ký nhận bản tin để cập nhật thông tin mới nhất.
                    </p>
                    <div className='flex items-center justify-start gap-4 mt-4'>
                        <input
                            className='px-3 py-2 border border-gray-200 rounded-md shadow-sm'
                            placeholder='Dịa chỉ email'
                            type="text" />
                        <button className='px-6 py-[10px] bg-gray-800 text-white rounded-md'>Đăng ký</button>
                    </div>
                </div>

                <div className='mx-auto font-semibold'>
                    <p>Liên Kết Nhanh</p>
                    <div className='mt-5'>
                        <p className='mt-2 text- font-normal hover:text-blue-500 hover:underline'>
                            <Link href={''}>Trang Chủ</Link>
                        </p>
                        <p className='mt-2 text-base font-normal hover:text-blue-500 hover:underline'>
                            <Link href={''}>Giới Thiệu</Link>
                        </p>
                    </div>
                </div>

                <div className='mx-auto font-semibold'>
                    <p>Ngành Nghề</p>
                    <div className='mt-5'>
                        <p className='mt-2 text- font-normal hover:text-blue-500 hover:underline'>
                            <Link href={''}>Bán Lẻ & Thương Mại Điện Tử</Link>
                        </p>
                        <p className='mt-2 text-base font-normal hover:text-blue-500 hover:underline'>
                            <Link href={''}>Công Nghệ Thông Tin</Link>
                        </p>
                    </div>
                </div>
            </div>
            <div className='mt-6 h-[1px] w-11/12 mx-auto bg-gray-400'></div>
            <div className='my-8 flex items-center justify-between'>
                <div>logo icon</div>
                {/* <Image src={} width={100} height={100} /> */}
                <div className='flex items-center gap-4'>
                    <p className='text-base font-normal'>Coppy right @2025 by Top Gear Store. Design by Top Gear Store</p>
                    {/* <Image
                        className='w-auto h-auto'
                        src={uytin} alt='uytin' width={100} height={100} /> */}
                </div>
            </div>
        </footer>
    )
}

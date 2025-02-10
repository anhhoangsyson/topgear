import Link from 'next/link'
import React from 'react'
import uytin from '../../../public/uytin.png'
import Image from 'next/image'
export default function Footer() {
    return (
        <footer className='pt-24'>
            <div className='grid grid-cols-3 '>
                <div className='col-span-1'>
                    <div>
                        <div className='mb-11'>
                            <div className='flex items-center justify-center w-11 h-11 rounded-full bg-blue-50'>
                                <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.125 2.95508V11.7051C17.125 12.2024 16.9275 12.6793 16.5758 13.0309C16.2242 13.3825 15.7473 13.5801 15.25 13.5801H2.75C2.25272 13.5801 1.77581 13.3825 1.42417 13.0309C1.07254 12.6793 0.875 12.2024 0.875 11.7051V2.95508M17.125 2.95508C17.125 2.4578 16.9275 1.98088 16.5758 1.62925C16.2242 1.27762 15.7473 1.08008 15.25 1.08008H2.75C2.25272 1.08008 1.77581 1.27762 1.42417 1.62925C1.07254 1.98088 0.875 2.4578 0.875 2.95508M17.125 2.95508V3.15758C17.125 3.4777 17.0431 3.7925 16.887 4.07199C16.7309 4.35148 16.5059 4.58636 16.2333 4.75425L9.98333 8.60008C9.68767 8.78219 9.34725 8.87862 9 8.87862C8.65275 8.87862 8.31233 8.78219 8.01667 8.60008L1.76667 4.75508C1.4941 4.58719 1.26906 4.35232 1.11297 4.07282C0.95689 3.79333 0.874965 3.47853 0.875 3.15841V2.95508" stroke="#3B82F6" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <p className='mt-2 text-base font-bold'>Email</p>
                                <p className='mt-2 text-sm font-normal'>
                                    Liên hệ với chúng tôi
                                </p>
                                <p className='mt-2 text-sm font-normal text-blue-400'>
                                    topgearcontact@gmail.com
                                </p>
                            </div>
                        </div>
                        <div className='mb-11'>
                            <div className='flex items-center justify-center w-11 h-11 rounded-full bg-blue-50'>
                                <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.125 2.95508V11.7051C17.125 12.2024 16.9275 12.6793 16.5758 13.0309C16.2242 13.3825 15.7473 13.5801 15.25 13.5801H2.75C2.25272 13.5801 1.77581 13.3825 1.42417 13.0309C1.07254 12.6793 0.875 12.2024 0.875 11.7051V2.95508M17.125 2.95508C17.125 2.4578 16.9275 1.98088 16.5758 1.62925C16.2242 1.27762 15.7473 1.08008 15.25 1.08008H2.75C2.25272 1.08008 1.77581 1.27762 1.42417 1.62925C1.07254 1.98088 0.875 2.4578 0.875 2.95508M17.125 2.95508V3.15758C17.125 3.4777 17.0431 3.7925 16.887 4.07199C16.7309 4.35148 16.5059 4.58636 16.2333 4.75425L9.98333 8.60008C9.68767 8.78219 9.34725 8.87862 9 8.87862C8.65275 8.87862 8.31233 8.78219 8.01667 8.60008L1.76667 4.75508C1.4941 4.58719 1.26906 4.35232 1.11297 4.07282C0.95689 3.79333 0.874965 3.47853 0.875 3.15841V2.95508" stroke="#3B82F6" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <p className='mt-2 text-base font-bold'>Địa chỉ</p>
                                <p className='mt-2 text-sm font-normal'>
                                    CVPM QTRUNG, Q12, TP.HCM
                                </p>
                                <p className='mt-2 text-sm font-normal text-blue-400'>
                                    nằm trong khu công viên phần mềm
                                </p>
                            </div>
                        </div>
                        <div className='mb-11'>
                            <div className='flex items-center justify-center w-11 h-11 rounded-full bg-blue-50'>
                                <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.125 2.95508V11.7051C17.125 12.2024 16.9275 12.6793 16.5758 13.0309C16.2242 13.3825 15.7473 13.5801 15.25 13.5801H2.75C2.25272 13.5801 1.77581 13.3825 1.42417 13.0309C1.07254 12.6793 0.875 12.2024 0.875 11.7051V2.95508M17.125 2.95508C17.125 2.4578 16.9275 1.98088 16.5758 1.62925C16.2242 1.27762 15.7473 1.08008 15.25 1.08008H2.75C2.25272 1.08008 1.77581 1.27762 1.42417 1.62925C1.07254 1.98088 0.875 2.4578 0.875 2.95508M17.125 2.95508V3.15758C17.125 3.4777 17.0431 3.7925 16.887 4.07199C16.7309 4.35148 16.5059 4.58636 16.2333 4.75425L9.98333 8.60008C9.68767 8.78219 9.34725 8.87862 9 8.87862C8.65275 8.87862 8.31233 8.78219 8.01667 8.60008L1.76667 4.75508C1.4941 4.58719 1.26906 4.35232 1.11297 4.07282C0.95689 3.79333 0.874965 3.47853 0.875 3.15841V2.95508" stroke="#3B82F6" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <p className='mt-2 text-base font-bold'>Số điện thoại liên hệ</p>
                                <p className='mt-2 text-sm font-normal'>
                                    Làm việc từ thứ 2 đến thứ 7 hàng tuần
                                </p>
                                <p className='mt-2 text-sm font-normal text-blue-400'>
                                    0123456789
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-2'>
                    <div className='w-full h-full'><iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1959.2173532270174!2d106.622246!3d10.854504!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bee0b0ef9e5%3A0x5b4da59e47aa97a8!2zQ8O0bmcgVmnDqm4gUGjhuqduIE3hu4FtIFF1YW5nIFRydW5n!5e0!3m2!1svi!2sus!4v1739176826639!5m2!1svi!2sus" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe></div></div>
            </div>
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
                    <Image
                        className='w-auto h-auto'
                        src={uytin} alt='uytin' width={100} height={100} />
                </div>
            </div>
        </footer>
    )
}

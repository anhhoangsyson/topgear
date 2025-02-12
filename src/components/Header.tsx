import Link from 'next/link'
import React from 'react'

export default function Header() {

    const menuNavData = [
        {
            name: 'Trang chủ',
            url: '/'
        },
        {
            name: 'Tất cả sản phẩm',
            url: '/tat-ca-san-pham'
        },
        {
            name: 'Blogs',
            url: '/blogs'
        },
        {
            name: 'Liên hệ',
            url: '/lien-he'
        }
    ]
    return (
        <>
            <div className='flex align-center justify-between py-4 px-24 shadow-lg'> 
                {/* logo */}
                <div>
                    <Link href={'/'}>
                        logo img</Link>
                </div>
                {/* nav menu */}
                <nav>
                    <ul className='flex '>
                        {menuNavData.map((item, index) => (
                            <li key={index} className={`px-4 py-2 ${index === 0 ? 'text-blue-600 font-bold' : ''}`}>
                                <Link href={item.url}>
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                {/* riglt nav */}
                <div>
                    <div className='flex gap-x-1 items-center'>
                        <div className='flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-200 cursor-pointer'>
                            <Link href='/search'>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                </button>
                            </Link>
                        </div>
                        <div className='flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-200 cursor-pointer'>

                            <Link href={'/cart'}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>

                                </div>
                            </Link>
                        </div>
                        <div className='flex items-center bg-blue-600 text-white rounded-md'>
                            <button className='flex items-center gap-x-1 px-6 py-4 bg-blue-500 text-white rounded-md text-base'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                Đăng nhập
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

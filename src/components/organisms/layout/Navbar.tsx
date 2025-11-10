'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import banner from '@/../public/banner.png'

export default function Navbar() {

    const topPosition = ["-top-0", "-top-12", "-top-24", "-top-36", "-top-48", "-top-60", "-top-62", "-top-74"]

    interface Category {
        categoryName: string,
        _id: string,
        children: Category[]
    }

    const [categoriesMenu, setCategoriesMenu] = useState<Category[]>([])
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const data = await fetch('https://top-gear-be.vercel.app/api/v1/categories/tree')
    //         const categories = await data.json()
    //         setCategoriesMenu(categories.data)

    //     }
    //     fetchData()
    // }, [])

    return (
        <div className='flex flex-col lg:flex-row my-4 gap-4'>
            {/* Categories Menu - Hidden on mobile, shown on desktop */}
            {categoriesMenu.length > 0 && (
                <nav className='hidden lg:flex flex-col rounded pb-4 w-60 bg-white'>
                    <ul className="">
                        {categoriesMenu.map((item: Category, index: number) => (
                            <li
                                key={index}
                                className='relative group px-4 py-3 hover:bg-gray-100 hover:text-blue-500 '
                            >
                                <Link
                                    className='font-normal text-sm '
                                    href={`/c/${item._id}`}>
                                    {item.categoryName}
                                </Link>
                                {/* dropdown menu */}
                                <div
                                    className={`grid grid-cols-5 absolute -top- ${topPosition[index]} left-full min-w-[800px] w-full rounded bg-white opacity-0 invisible shadow-lg group-hover:opacity-100 group-hover:visible group-hover:shadow-lg group-hover:z-10 transition-all duration-300 ease-in-out`}>
                                    {item.children.map((child: Category, index: number) => (
                                        <div
                                            key={index}
                                            className='block py-3 px-4 text-[#0e1746] font-semibold text-base h-full'>
                                            {child.categoryName}
                                            <div
                                                className='grid grid-cols-1 gap-2 mt-2'>
                                                {child.children.map((subChild: Category, index: number) => (
                                                    <div
                                                        key={index}
                                                        className='text-gray-500 hover:text-blue-500 text-xs font-normal text-nowrap rounded'>
                                                        <Link
                                                            href={`/c/${subChild._id}`}
                                                        >
                                                            {subChild.categoryName}
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
            
            {/* Banner - Full width on mobile, flex-1 on desktop */}
            <div className="w-full lg:flex-1 mx-auto rounded">
                <Image
                    className="w-full h-auto rounded"
                    alt="banner"
                    src={banner}
                    priority
                />
            </div>
        </div>
    )
}

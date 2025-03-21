'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { use, useEffect, useState } from 'react'
import banner from '@/../public/banner.png'

export default function Navbar() {

    const topPosition = ["-top-0", "-top-12", "-top-24", "-top-36", "-top-48", "-top-50", "-top-62", "-top-74"]

    interface Category {
        categoriesName: string;
        subCategories: { name: string; children: { name: string }[] }[];
    }

    const [categoriesMenu, setCategoriesMenu] = useState<Category[]>([])
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch('http://localhost:3000/api/v1/categories')
            const categoriesMenu = await data.json()
            setCategoriesMenu(categoriesMenu.data)
        }
        fetchData()
    }, [])

    return (
        <div className='flex my-4 gap-x-4'>
            {/* right side is menu categories */}
            <nav className='flex flex-col rounded  pb-4 w-60 bg-white '>
                <ul className="">
                    {categoriesMenu.map((item, index) => (
                        <li
                            key={index}
                            className='relative group px-4 py-3 hover:bg-gray-100 hover:text-blue-500 '
                        >
                            <Link
                                className='font-nomral text-sm '
                                href={item.categoriesName}>
                                {item?.categoriesName}
                            </Link>
                            {/* dropdown menu */}
                            <ul
                                className={`absolute -top- ${topPosition[index]} left-full min-w-60 rounded bg-white opacity-0 invisible shadow-lg group-hover:opacity-100 group-hover:visible group-hover:shadow-lg group-hover:z-10 transition-all duration-300 ease-in-out`}>
                                {item.subCategories.map((child, index) => (
                                    <li
                                        key={index}
                                        className='block py-3 px-4 text-gray-700 font-bold text-base'>
                                        {child.name}
                                        <div
                                            className='flex'>
                                            {child.children.map((subChild, index) => (
                                                <div
                                                    key={index}
                                                    className='py-2 px-4 text-gray-700 hover:bg-gray-100 text-sm font-normal text-nowrap rounded'>
                                                    <Link
                                                        href={`subChild.href`}
                                                    >
                                                        {subChild.name}
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </nav>
            {/* left side is banner */}
            <div className="w-full h-full mx-auto rounded">
                <Image
                    className="w-full h-auto rounded"
                    alt="banner"
                    src={banner}>
                </Image>
            </div>
        </div>
    )
}

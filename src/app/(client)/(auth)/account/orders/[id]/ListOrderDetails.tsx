'use client'
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { IProductVariantRes, OrderDetail } from '@/types';
import Image from 'next/image';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Skeleton = () => {
    return (
        <div>
            <div
                className='flex gap-x-4 items-center animate-pulse justify-between p-4 mb-4 bg-white rounded'>
                <div className='w-24 h-24 bg-gray-300 animate-pulse'></div>
                <p className='w-full h-4 bg-gray-300 animate-pulse rounded mt-2'></p>
            </div>
        </div>
    )
}

export default function ListOrderDetails({ orderDetails }: { orderDetails: [OrderDetail] }) {
    
    const [productVariants, setProductVariants] = useState<IProductVariantRes[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductVariants = async () => {
            try {
                setLoading(true);
                // Gọi fetch cho từng item._id bằng Promise.all
                const fetchPromises = orderDetails.map((item) =>
                    fetch(`https://top-gear-be.vercel.app/api/v1/pvariants/${item.productVariantId}`, {
                        method: 'GET',
                    }).then((res) => {
                        if (!res.ok) {
                            console.error(`Failed to fetch variant ${item.productVariantId}`);
                        }
                        return res.json();
                    })
                        .then((data) => {
                            // Kiểm tra nếu data là mảng và có ít nhất một phần tử
                            if (Array.isArray(data) && data.length > 0) {
                                return { productVariantId: item.productVariantId, ...data[0] }; // Lấy object đầu tiên
                            }
                            console.warn(`No valid data for variant ${item.productVariantId}`);
                            return null;
                        })
                );

                const results = await Promise.all(fetchPromises);
                console.log('results', typeof results, results);
                console.log('results[0]', typeof results[0], results[0]);

                const validVariants = results.filter((variant) => variant !== null);
                console.log('validVariants', validVariants);
                
                setProductVariants(validVariants);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        if (orderDetails.length > 0) {
            fetchProductVariants();
        }
    }, [orderDetails]); // Dependency: chạy lại khi orderDetails thay đổi

    if (loading) return <div><Skeleton /></div>;
    if (error) return <div>Error: {error}</div>;


    return (
        <div>
            {orderDetails.map((item: OrderDetail, index: number) => (
                <div
                    key={index}
                    className='flex items-center justify-between p-4 mb-4 gap-x-4 bg-white rounded'>
                    {productVariants.length > 0 ? (
                        <div
                            className='flex gap-x-4 items-center justify-between'>
                            <Image
                                src={productVariants[index]?.images[0]?.imageUrl || '/cardgift.png'}
                                alt="order"
                                width={100}
                                height={100}
                                className='w-auto h-24 rounded-md object-cover'
                            />
                            <Link
                                href={productVariants[index]?._id ? `/products/${productVariants[index]?._id}` : '#'}>
                                <p className='text-blue-500 cursor-pointer text-sm '>{productVariants[index]?.variantName}</p>
                            </Link>
                        </div>
                    ) : (<Skeleton />)}


                    <div className='flex gap-x-4 items-baseline'>
                        <p><span>{formatPrice(item.price)}</span></p>
                        x
                        <p><span>{item.quantity}</span></p>
                    </div>
                    <div className='flex flex-col gap-y-8'>
                        <p><span>{formatPrice(item.subTotal)}</span></p>
                        <Button
                            onClick={() => { location.href = `/products/${item.productVariantId}`; }}
                            className='bg-blue-500 text-white'
                            variant={'outline'}
                            size={'sm'}>
                            Mua lại
                        </Button>
                    </div>

                </div>
            ))}
        </div>
    )
}

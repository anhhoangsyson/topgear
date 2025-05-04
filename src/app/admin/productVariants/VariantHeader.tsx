import { formatPrice } from '@/lib/utils';
import React from 'react'
import { caculateSalePercent } from '../../../lib/utils';

const VariantHeader = ({ name, price, salePrice }: { name: string, price: string, salePrice: string }) => (
    <div>
        <h1 className="text-2xl font-bold">{name}</h1>
        <div className="flex items-center gap-3 mt-2">
            {salePrice && (
                <span className="text-3xl font-bold text-red-600">
                    {formatPrice(salePrice)}
                </span>
            )}
            <span className={`text-xl ${salePrice ? "line-through text-gray-500" : "font-bold"}`}>
                {formatPrice(price)}
            </span>
            {salePrice && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                    {caculateSalePercent(parseInt(price), parseInt(salePrice))}
                </span>
            )}
        </div>
    </div>
);

export default VariantHeader
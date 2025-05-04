import { Badge } from '@/components/ui/badge';
import React from 'react'

const StockStatus = ({ stock, status }:
    { stock: number, status: string}) => (
        <div className="flex items-center gap-4">
            <div>
                <span className="text-gray-600">Tồn kho:</span>
                <span className={`ml-2 font-bold ${stock === 0 ? "text-red-600" : "text-green-600"}`}>
                    {stock === 0 ? "Hết hàng" : `${stock} sản phẩm`}
                </span>
            </div>
            <Badge variant={status === "active" ? "default" : "destructive"}>
                {status === "active" ? "Đang bán" : "Ngừng bán"}
            </Badge>
        </div>
    );

export default StockStatus

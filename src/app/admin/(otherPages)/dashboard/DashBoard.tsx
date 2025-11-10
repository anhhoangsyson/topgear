import React from 'react'
interface DashBoardProps {
    data: {
        totalOrders: number;
        totalUsers: number;
        totalRevenue: number;
        bestSellers: {
            producdId: string;
            name: string;
            sold: number;
        }
        topRevenueProducts: {
            productId: string;
            name: string;
            revenue: number;
        }
        growth: {
            orders: number;
            revenue: number;
        }
    }
}

export default function DashBoard({ data: _data }: DashBoardProps) {
    return (
        <div>

        </div>
    )
}

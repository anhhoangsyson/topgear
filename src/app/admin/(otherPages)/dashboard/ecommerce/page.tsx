import BestSellersAndTopRevenue from "@/app/admin/components/ecommerce/BestSellersAndTopRevenue";
import { EcommerceMetrics } from "@/app/admin/components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/app/admin/components/ecommerce/MonthlySalesChart";
import RecentOrders from "@/app/admin/components/ecommerce/RecentOrders";
import OrderNotificationWidget from "@/app/admin/components/ecommerce/OrderNotificationWidget";
import type { Metadata } from "next";
import React from "react";

interface IDashBoardSummaryResponse {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    bestSellers: {
        productId: string;
        name: string;
        sold: number;
    }[];
    topRevenueProduct: {
        productId: string;
        name: string;
        revenue: number;
    };
    growth: {
        orders: number;
        users: number;
        revenue: number;
    };
    monthlySales: {
        _id: {
            month: number;
            year: number;
        };
        totalSales: number;
        totalRevenue: number;
    },
    monthlySalesFull: {
        year: number;
        month: number;
        totalOrders: number;
        totalRevenue: number;
    }[];
    recentOrders: {
        _id: string;
        totalAmount: number;
        orderStatus: string;
        createdAt: string;
        products: string[];
        user: {
            fullname: string;
            email: string;
        }
    }[];
}

async function fetchData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/admin/dashboard/summary`, {
        method: "GET",
    })

    if (!res.ok) throw new Error("Failed to fetch data");

    const data = await res.json();
    return data as IDashBoardSummaryResponse;
}
export const metadata: Metadata = {
    title:
        "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default async function Ecommerce() {
    const data = await fetchData();
    console.log(data);
    console.log(data.topRevenueProduct);

    if (!data) return <div>Error loading data</div>;

    return (
        <div className="grid gap-4 md:gap-6">
            <div className="col-span-12 space-y-6 xl:col-span-7">
                <p
                    className="text-xl font-semibold text-gray-800 dark:text-white/90"
                >DashBoard</p>
            </div>
            <div className="col-span-12">
                <EcommerceMetrics
                    growthOrders={data.growth.orders}
                    growthRevenue={data.growth.revenue}
                    growthUsers={data.growth.users}
                    totalOrders={data.totalOrders}
                    totalRevenue={data.totalRevenue}
                    totalUsers={data.totalUsers}
                />
            </div>
            <div className="col-span-12">
                <BestSellersAndTopRevenue
                    bestSellers={data.bestSellers}
                    topRevenueProduct={data.topRevenueProduct}
                />
            </div>
            <div className="col-span-12">
                <MonthlySalesChart
                    monthlySales={data.monthlySalesFull}
                />
            </div>
            <div className="col-span-12">
                <OrderNotificationWidget />
            </div>
            <div className="col-span-12">
                <RecentOrders
                    recentOrders={data.recentOrders}
                />
            </div>

        </div>
    );
}

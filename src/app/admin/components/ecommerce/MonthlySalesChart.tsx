"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

interface MonthlySalesChartProps {
    monthlySales: {
        year: number;
        month: number;
        totalOrders: number;
        totalRevenue: number;
    }[];
}

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export default function MonthlySalesChart({ monthlySales }: MonthlySalesChartProps) {
    // map data cho 12 thang
    const ordersData = Array(12).fill(0);
    const revenueData = Array(12).fill(0);

    monthlySales.forEach(item => {
        const idx = item.month - 1;
        ordersData[idx] = item.totalOrders;
        revenueData[idx] = item.totalRevenue;
    });

    const options: ApexOptions = {
        colors: ["#334155", "#be185d"],
        chart: { fontFamily: "Outfit, sans-serif", type: "bar", height: 180, toolbar: { show: false } },
        plotOptions: { bar: { horizontal: false, columnWidth: "39%", borderRadius: 5, borderRadiusApplication: "end" } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 4, colors: ["transparent"] },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            axisBorder: { show: false }, axisTicks: { show: false }
        },
        legend: { show: true, position: "top", horizontalAlign: "left", fontFamily: "Outfit" },
        yaxis: { title: { text: undefined } },
        grid: { yaxis: { lines: { show: true } } },
        fill: { opacity: 1 },
        tooltip: {
            x: { show: false },
            y: { formatter: (val: number) => `${val}` },
        },
    };

    const series = [
        { name: "Đơn hàng", data: ordersData },
        { name: "Doanh thu", data: revenueData },
    ];

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Doanh thu hàng tháng</h3>
            </div>
            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
                    <ReactApexChart options={options} series={series} type="bar" height={180} />
                </div>
            </div>
        </div>
    );
}

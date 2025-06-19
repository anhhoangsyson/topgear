"use client";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/app/admin/icons";
import { Badge } from "@/components/atoms/ui/badge";
import { ChartAreaIcon } from "lucide-react";
import React from "react";
interface EcommerceMetricsPropps {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  growthUsers: number;
  growthOrders: number;
  growthRevenue: number;
}

export const EcommerceMetrics = ({ totalUsers, growthUsers, totalOrders, growthOrders, totalRevenue, growthRevenue }: EcommerceMetricsPropps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Số lượng user
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalUsers}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {growthUsers === null ? "∞" : `${growthUsers * 100} %`}
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalOrders}
            </h4>
          </div>

          <Badge color="error">
            <ArrowUpIcon className="text-error-500" />
            {growthOrders === null ? "∞" : `${growthOrders * 100} %`}
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <ChartAreaIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Tổng doanh thu
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalRevenue.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </h4>
          </div>
          <Badge color="error">
            <ArrowUpIcon className="text-error-500" />
            {growthRevenue === null ? "∞" : `${growthRevenue * 100} %`}
          </Badge>
        </div>
      </div>
    </div>
  );
};

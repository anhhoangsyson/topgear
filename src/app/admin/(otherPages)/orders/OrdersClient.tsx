'use client'
import { orderColumns } from '@/app/admin/(otherPages)/orders/order-columns';
import OrderPreviewModal from '@/app/admin/(otherPages)/orders/OrderPreviewModal';
import { DataTable } from '@/components/common/data-table';
import { IOrderWithDetails } from '@/types';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';

export default function OrdersClient() {
  const searchParams = useSearchParams();
  const orderIdFromQuery = searchParams.get('orderId');

  useEffect(() => {
    const fetOrders = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/order/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch attributes");
      }
      const data = await res.json();
      setOrders(data.data);
      
      // Auto-open modal if orderId is in query params
      if (orderIdFromQuery && data.data) {
        const order = data.data.find((o: IOrderWithDetails) => 
          o._id === orderIdFromQuery || o._id?.includes(orderIdFromQuery)
        );
        if (order) {
          setSelectedOrder(order);
          setShowModalPreview(true);
        }
      }
    }
    fetOrders()
  }, [orderIdFromQuery]);

  const [selectedOrder, setSelectedOrder] = useState<IOrderWithDetails | null>(null);
  const [showModalPreview, setShowModalPreview] = useState(false);
  const [orders, setOrders] = useState<IOrderWithDetails[]>([]);

  const handleShowOrderPreview = (order: IOrderWithDetails) => {
    setSelectedOrder(order);
    setShowModalPreview(true);
  }

  const handleOrderUpdate = (updatedOrder: IOrderWithDetails) => {
    // Update order in list
    setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    // Update selected order if it's the same
    if (selectedOrder?._id === updatedOrder._id) {
      setSelectedOrder(updatedOrder);
    }
  }

  return (
    <div className="container mx-auto py-6 sm:py-10 px-4">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Quản lý đơn hàng
        </h1>
        <p className="text-gray-600 mb-4">
          Xem và quản lý tất cả đơn hàng của khách hàng
        </p>
        <div className="flex gap-3">
          <a 
            href="/admin/orders/pending" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Đơn hàng chưa xử lý
          </a>
          <a 
            href="/admin/orders/processed" 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Đơn hàng đã xử lý
          </a>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border">
        <DataTable
          columns={orderColumns(handleShowOrderPreview)}
          data={orders}
          searchBy={"_id"}
        />
      </div>
      
      <OrderPreviewModal
        order={selectedOrder || null}
        open={showModalPreview}
        onClose={() => { setShowModalPreview(false); setSelectedOrder(null) }}
        onOrderUpdate={handleOrderUpdate}
      />
    </div>
  );
}

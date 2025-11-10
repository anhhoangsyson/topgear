'use client'
import { orderColumns } from '@/app/admin/(otherPages)/orders/order-columns';
import OrderPreviewModal from '@/app/admin/(otherPages)/orders/OrderPreviewModal';
import { DataTable } from '@/components/common/data-table';
import { IOrderWithDetails } from '@/types';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';

export default function PendingOrdersPage() {
  const searchParams = useSearchParams();
  const orderIdFromQuery = searchParams.get('orderId');

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/order/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await res.json();
      
      // Filter chỉ lấy đơn hàng chưa xử lý (pending, payment_pending, payment_cancelling)
      const pendingOrders = data.data.filter((order: IOrderWithDetails) => 
        ['pending', 'payment_pending', 'payment_cancelling'].includes(order.orderStatus)
      );
      
      setOrders(pendingOrders);
      
      // Auto-open modal if orderId is in query params
      if (orderIdFromQuery && pendingOrders) {
        const order = pendingOrders.find((o: IOrderWithDetails) => 
          o._id === orderIdFromQuery || o._id?.includes(orderIdFromQuery)
        );
        if (order) {
          setSelectedOrder(order);
          setShowModalPreview(true);
        }
      }
    }
    fetchOrders()
  }, [orderIdFromQuery]);

  const [selectedOrder, setSelectedOrder] = useState<IOrderWithDetails | null>(null);
  const [showModalPreview, setShowModalPreview] = useState(false);
  const [orders, setOrders] = useState<IOrderWithDetails[]>([]);

  const handleShowOrderPreview = (order: IOrderWithDetails) => {
    setSelectedOrder(order);
    setShowModalPreview(true);
  }

  const handleOrderUpdate = (updatedOrder: IOrderWithDetails) => {
    // Remove updated order if its status is no longer pending
    if (!['pending', 'payment_pending', 'payment_cancelling'].includes(updatedOrder.orderStatus)) {
      setOrders(prev => prev.filter(o => o._id !== updatedOrder._id));
    } else {
      // Update order in list if status is still pending
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    }
    // Update selected order if it's the same
    if (selectedOrder?._id === updatedOrder._id) {
      setSelectedOrder(updatedOrder);
    }
  }

  return (
    <div className="container mx-auto py-6 sm:py-10 px-4">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Đơn hàng chưa xử lý
        </h1>
        <p className="text-gray-600">
          Quản lý các đơn hàng đang chờ xử lý (pending, payment_pending, payment_cancelling)
        </p>
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


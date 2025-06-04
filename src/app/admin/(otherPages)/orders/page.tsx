'use client'
import { orderColumns } from '@/app/admin/(otherPages)/orders/order-columns';
import OrderPreviewModal from '@/app/admin/(otherPages)/orders/OrderPreviewModal';
import { DataTable } from '@/components/common/data-table';
import { IOrderWithDetails } from '@/types';
import React, { useEffect, useState } from 'react'



export default function OrdersPage() {

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
    }
    fetOrders()
  }, []);

  const [selectedOrder, setSelectedOrder] = useState<IOrderWithDetails | null>(null);
  const [showModalPreview, setShowModalPreview] = useState(false);
  const [orders, setOrders] = useState<IOrderWithDetails[]>([]);

  const handleShowOrderPreview = (order: any) => {
    setSelectedOrder(order);
    setShowModalPreview(true);
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={orderColumns(handleShowOrderPreview)}
        data={orders}
        searchBy={"_id"} // Set default searchBy to attributeName if data is not empty
      />
      <OrderPreviewModal
        order={selectedOrder || null}
        open={showModalPreview}
        onClose={() => { setShowModalPreview(false); setSelectedOrder(null) }}
      />
    </div>
  );
}
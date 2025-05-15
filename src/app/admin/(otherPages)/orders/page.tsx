import { DataTable } from '@/app/admin/attributes/data-table';
import { orderColumns, OrderRes } from '@/app/admin/orders/order-columns';
import React from 'react'

async function fetchOrder(): Promise<OrderRes[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/order/all`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch attributes");
    }

    const data = await res.json();
      console.log("data", data);
      

    return data.data



}

export default async function AttributesPage() {
  try {
    const data = await fetchOrder();

    return (
      <div className="container mx-auto py-10">

        <DataTable
          columns={orderColumns}
          data={data}
          searchBy={"_id"} // Set default searchBy to attributeName if data is not empty
        />

      </div>
    );
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return (
      <div className="container mx-auto py-10">
        <p className="text-red-500">Không thể tải dữ liệu thuộc tính. Vui lòng thử lại sau.</p>
      </div>
    );
  }
}
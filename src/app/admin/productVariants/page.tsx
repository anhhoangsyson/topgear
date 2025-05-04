import { DataTable } from '@/app/admin/attributes/data-table';
import { productVariantColumns } from '@/app/admin/productVariants/product-variant-columns';
import { Button } from '@/components/ui/Button';
import { ProductsVariantsRes } from '@/types/Res/Product';
import Link from 'next/link';
import React from 'react'

async function fetchProductVariants(): Promise<ProductsVariantsRes[]> {
  return [{
    "_id": "67e41e468ceba80987b5fd9c",
    "variantName": "Laptop Acer Nitro 5 (16GB/Đen)",
    "variantPrice": 2349000,
    "variantPriceSale": 2049000,
    "variantStock": 99,
    "status": true,
    "thumbnail": "https://res.cloudinary.com/drsm6hdbe/image/upload/v1742612395/upload/macbook_2__13.jpg",
    "productName": "Laptop Acer Nitro 5",
    "createdAt": "cacacacaca",
  }]
}

export default async function ProductVariantsPage() {
  try {
    const data = await fetchProductVariants();
    return (
      <div className="container mx-auto py-4 h-screen">
        <div className="flex items-center justify-between gap-x-8 mb-8">
          <h2 className="text-3xl text-black font-bold">Quản lý các dòng sản phẩm của bạn</h2>
          <Link
            href={'/admin/productVariant/add'}>
            <Button
            >
              Thêm biến thể mới
            </Button>
          </Link>
        </div>
        <DataTable
          columns={productVariantColumns}
          data={data}
          searchBy="variantName"
        />

      </div>
    )
  } catch (error) {
    console.log(error, "error");
    return (
      <div className="container mx-auto py-10">
        <p className="text-red-500">Không thể tải dữ liệu biến thể. Vui lòng thử lại sau.</p>
      </div>
    )

  }
}

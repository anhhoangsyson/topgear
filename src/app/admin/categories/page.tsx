import { DataTable } from '@/app/admin/attributes/data-table';
import { categoriesColumns } from '@/app/admin/categories/category-columns';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import React from 'react'

async function fetchCategories(){
  return[
    {
      "_id": "67df79dee5634c8a7f6df94a",
      "categoryName": "Điện thoại",
      "parentCategoryId": null,
      "isFilter": false,
      "isDeleted": false,
      "createdAt": "2025-03-23T03:02:54.032Z",
  },
  ]
}

export default async function CategoriesPage() {
  try {
    const data = await fetchCategories();
    return (
      <div className="container mx-auto py-4 h-screen">
        <div className="flex items-center justify-between gap-x-8 mb-8">
          <h2 className="text-3xl text-black font-bold">Quản lý các danh mục của bạn</h2>
          <Link
            href={'/admin/categories/add'}>
            <Button
            >
              Thêm danh mục
            </Button>
          </Link>
        </div>
        <DataTable
          columns={categoriesColumns}
          data={data}
          searchBy="categoryName"
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

import AddCategoryForm from '@/app/admin/categories/add/AddCategoryForm'
import React from 'react'

export default function AddCategoryPage() {
  return (
    <div className='h-screen'>
        <h1 className='text-3xl font-bold uppercase text-gray-800 my-4 '>Thêm danh mục</h1>
      <AddCategoryForm
      />
    </div>
  )
}

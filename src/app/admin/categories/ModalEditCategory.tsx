import UpdateCategoryForm from '@/app/admin/categories/UpdateCategoryForm';
import { CategoriesRes } from '@/types/Res/Product'
import React from 'react'

export default function ModalEditCategory({ open, category, onClose }
    : { open: boolean, category: CategoriesRes, onClose: () => void }) {
    console.log(category, "category");

    return (
        <div>
            <UpdateCategoryForm
                category={category} onClose={onClose} />
        </div>
    )
}

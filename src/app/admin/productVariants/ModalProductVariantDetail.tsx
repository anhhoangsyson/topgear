import CategoryTags from '@/app/admin/productVariants/CategoryTags'
import StockStatus from '@/app/admin/productVariants/StockStatus'
import VariantAttributes from '@/app/admin/productVariants/VariantAttributes'
import VariantHeader from '@/app/admin/productVariants/VariantHeader'
import { Drawer } from '@/components/ui/drawer'
import React from 'react'
import ImageGallery from './ImageGallery';

export default function ModalProductVariantDetail({ id, onClose }: { id: string, onClose: () => void }) {
    // call api with id to get data 

    const data = {
        variantName: "Tên sản phẩm",
        variantPrice: "1000000",
        variantPriceSale: "800000",
        variantStock: 10,
        status: "active",
        attributes: [
            { attributeName: "Màu sắc", attributeValue: "Đỏ" },
            { attributeName: "Kích thước", attributeValue: "L" },
        ],
        categories: [
            { categoryId: "1", categoryName: "Thời trang" },
            { categoryId: "2", categoryName: "Điện tử" },
            { categoryId: "12", categoryName: "Thời trang" },
            { categoryId: "222", categoryName: "Điện tử" },
            { categoryId: "11", categoryName: "Thời trang" },
            { categoryId: "221", categoryName: "Điện tử" },
            { categoryId: "1111", categoryName: "Thời trang" },
            { categoryId: "23", categoryName: "Điện tử" },
        ],
        description: "<p>Mô tả sản phẩm chi tiết</p>",
        variantImages: [
            { id: 1, url: "https://res.cloudinary.com/drsm6hdbe/image/upload/v1742612395/upload/macbook_2__13.jpg" },
            { id: 2, url: "https://res.cloudinary.com/drsm6hdbe/image/upload/v1742612400/upload/mac_mini_with_m4_silver_pdp_image_position_5__vn-vi_2.jpg" },
        ]
    }
    const { variantImages, attributes, categories, description, status, variantName, variantPrice, variantPriceSale, variantStock } = data
    return (
        <Drawer
            onClose={onClose}
        >
            {/* Phần 1: Ảnh và thuộc tính chính */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Gallery ảnh (bên trái) */}
                <ImageGallery images={variantImages} />

                {/* Thông tin chi tiết (bên phải) */}
                <div className="space-y-4">
                    {/* Tên và giá */}
                    <VariantHeader
                        name={variantName}
                        price={variantPrice}
                        salePrice={variantPriceSale}
                    />

                    {/* Thuộc tính (attributes) */}
                    <VariantAttributes attributes={attributes} />

                    {/* Tồn kho và trạng thái */}
                    <StockStatus stock={variantStock} status={status} />

                    {/* Danh mục */}
                    <CategoryTags categories={categories} />
                </div>
            </div>
        </Drawer>
    )
}

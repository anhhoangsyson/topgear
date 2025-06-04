'use client'
import { Button } from '@/components/ui/Button'
import { ILaptop } from '@/types'
import { X } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

export default function LaptopDetailModal({
    open,
    onClose,
    laptop,
}: {
    open: boolean
    onClose: () => void
    laptop: ILaptop | null
}) {
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
    if (!open || !laptop) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative flex flex-col"
                style={{ maxHeight: '90vh' }}>
                <Button
                    variant={"secondary"}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    <div>
                        <X />
                    </div>
                </Button>
                <div
                    className="p-4 mt-6 overflow-y-auto" style={{ maxHeight: '75vh' }}>
                    <h2 className="text-xl font-bold mb-4">{laptop.name}</h2>
                    <div className="grid grid-cols-1 p-4 md:grid-cols-2 gap-4 border border-gray-300 rounded">
                        {/* Ảnh */}
                        <div>
                            {laptop.images && laptop.images.length > 0 ? (
                                <>
                                    <div>
                                        <Image
                                            width={500}
                                            height={500}
                                            alt={laptop.name}
                                            className="w-full h-64 object-cover rounded mb-2"
                                            src={selectedImg || laptop.images[0].imageUrl}
                                        />
                                    </div>
                                    <div className="flex gap-2 mb-2 flex-wrap">
                                        {laptop.images.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img.imageUrl}
                                                alt={img.altText || laptop.name}
                                                className="w-20 h-20 object-cover rounded border cursor-pointer hover:ring-2 hover:ring-blue-400"
                                                onClick={() => setSelectedImg(img.imageUrl)}
                                            />
                                        ))}
                                    </div>
                                  
                                </>
                            ) : (
                                <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded">
                                    Không có ảnh
                                </div>
                            )}
                        </div>
                        {/* Thông tin cơ bản */}
                        <div>
                            <div className="mb-2"><b>Model:</b> {laptop.modelName}</div>
                            <div className="mb-2"><b>Hãng:</b> {laptop.brandId?.name}</div>
                            <div className="mb-2"><b>Danh mục:</b> {laptop.categoryId?.name}</div>
                            <div className="mb-2"><b>Giá:</b> {laptop.price.toLocaleString()}₫</div>
                            {laptop.discountPrice && (
                                <div className="mb-2"><b>Giá giảm:</b> {laptop.discountPrice.toLocaleString()}₫</div>
                            )}
                            <div className="mb-2"><b>Tình trạng:</b> {laptop.status}</div>
                            <div className="mb-2"><b>Số lượng kho:</b> {laptop.stock}</div>
                            <div className="mb-2"><b>Năm phát hành:</b> {laptop.releaseYear || "?"}</div>
                            <div className="mb-2"><b>Bảo hành:</b> {laptop.warranty ? `${laptop.warranty} tháng` : "?"}</div>
                            <div className="mb-2"><b>Trạng thái:</b> {laptop.isActive ? "Đang bán" : "Ẩn"}</div>
                            <div className="mb-2"><b>Quảng cáo:</b> {laptop.isPromoted ? "Có" : "Không"}</div>
                            <div className="mb-2"><b>Đánh giá:</b> {laptop.ratings.average} ⭐ ({laptop.ratings.count} lượt)</div>
                            <div className="mb-2"><b>Tags:</b> {laptop.tags?.join(", ")}</div>
                        </div>
                    </div>
                    {/* Mô tả */}
                    <div className="mt-4">
                        <b>Mô tả:</b>
                        <div className="text-gray-700 whitespace-pre-line">{laptop.description || "Không có mô tả"}</div>
                    </div>
                    {/* Thông số kỹ thuật */}
                    <div className="mt-4">
                        <b>Thông số kỹ thuật:</b>
                        <ul className="text-gray-700 text-sm grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-2 min-h-20 space-y-2">
                            <li><b>CPU:</b> {laptop.specifications.processor}, {laptop.specifications.processorGen}, {laptop.specifications.processorSpeed} GHz</li>
                            <li><b>Card đồ họa:</b> {laptop.specifications.graphicsCard || "?"}</li>
                            <li><b>Ổ cứng:</b> {laptop.specifications.storage} GB {laptop.specifications.storageType}</li>
                            <li><b>RAM:</b> {laptop.specifications.ram} GB {laptop.specifications.ramType && `(${laptop.specifications.ramType})`}</li>
                            <li><b>Màn hình:</b> {laptop.specifications.displaySize} inch {laptop.specifications.displayResolution && `(${laptop.specifications.displayResolution})`} </li>
                            <li><b>Tần số quét:</b> {laptop.specifications.refreshRate ? `${laptop.specifications.refreshRate}Hz` : "?"}, {laptop.specifications.displayType}</li>
                            <li><b>Pin:</b> {laptop.specifications.battery} / {laptop.specifications.batteryLife} hour</li>
                            <li><b>CKN:</b> {laptop.specifications.ports || "?"}</li>
                            <li><b>KNKD:</b> {laptop.specifications.connectivity || "?"}</li>
                            <li><b>Bàn phím:</b> {laptop.specifications.keyboard || "?"}</li>
                            <li><b>Camera:</b> {laptop.specifications.webcam || "?"}</li>
                            <li><b>Cảm ứng:</b> {laptop.specifications.touchscreen === true ? "Có" : "Không"}</li>
                            <li><b>Âm thanh:</b> {laptop.specifications.speakers}</li>
                        </ul>
                    </div>
                    {/* SEO Metadata */}
                    {laptop.seoMetadata && (
                        <div className="mt-4">
                            <b>SEO Metadata:</b>
                            <div className="text-xs text-gray-500">
                                <div><b>Meta title:</b> {laptop.seoMetadata.metaTitle}</div>
                                <div><b>Meta description:</b> {laptop.seoMetadata.metaDescription}</div>
                                <div><b>Keywords:</b> {laptop.seoMetadata.keywords?.join(", ")}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
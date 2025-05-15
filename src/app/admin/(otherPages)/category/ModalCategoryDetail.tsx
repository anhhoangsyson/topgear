import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CategoryDetail {
    categoryName: string;
    _id: string;
    parentCategoryId: string | null;
    children: CategoryDetail[];
}

export default function ModalCategoryDetail({ id, open, onClose }: { id: string; open: boolean, onClose: () => void }) {
    const categoryDetail: CategoryDetail = {
        categoryName: "Hãng",
        _id: "67fe866dc25cc1af762a1592",
        parentCategoryId: "67fe8631c25cc1af762a158c",
        children: [
            {
                categoryName: "Akko",
                _id: "67fe872cc25cc1af762a15a4",
                parentCategoryId: "67fe866dc25cc1af762a1592",
                children: [
                    {
                        categoryName: "Akko Sub 1",
                        _id: "67fe872cc25cc1af762a15a5",
                        parentCategoryId: "67fe872cc25cc1af762a15a4",
                        children: [],
                    },
                ],
            },
            {
                categoryName: "Logitech",
                _id: "67fe8740c25cc1af762a15a7",
                parentCategoryId: "67fe866dc25cc1af762a1592",
                children: [],
            },
        ],
    };

    const ITEMS_PER_PAGE = 2; // Số lượng danh mục con hiển thị trên mỗi trang

    // Quản lý trạng thái mở rộng và phân trang bằng Map
    const [expandedState, setExpandedState] = useState<Map<string, boolean>>(new Map());
    const [paginationState, setPaginationState] = useState<Map<string, number>>(new Map());

    const toggleExpand = (id: string) => {
        setExpandedState((prev) => new Map(prev).set(id, !prev.get(id)));
    };

    const loadMore = (id: string, totalChildren: number) => {
        setPaginationState((prev) => {
            const currentPage = prev.get(id) || 1;
            const totalPages = Math.ceil(totalChildren / ITEMS_PER_PAGE);
            if (currentPage < totalPages) {
                return new Map(prev).set(id, currentPage + 1);
            }
            return prev;
        });
    };

    const renderCategory = (category: CategoryDetail) => {
        const isExpanded = expandedState.get(category._id) || false;
        const currentPage = paginationState.get(category._id) || 1;

        const totalPages = Math.ceil(category.children.length / ITEMS_PER_PAGE);
        const paginatedChildren = category.children.slice(0, currentPage * ITEMS_PER_PAGE);

        return (
            <div key={category._id} className="pl-4">
                <div
                    className="cursor-pointer flex items-center"
                    onClick={() => toggleExpand(category._id)}
                >
                    {category.children.length > 0 && (
                        <span className="mr-2">{isExpanded ? "-" : "+"}</span>
                    )}
                    {category.categoryName}
                </div>
                {isExpanded && (
                    <div className="pl-4">
                        {paginatedChildren.map((child) => renderCategory(child))}
                        {currentPage < totalPages && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => loadMore(category._id, category.children.length)}
                            >
                                Xem thêm
                            </Button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Dialog 
        open={open} 
        onOpenChange={(isOpen) => !isOpen && onClose()}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chi tiết danh mục</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-72 w-full rounded-md border">
                    <div className="p-4">
                        <h4 className="mb-4 text-lg font-medium leading-none">{categoryDetail.categoryName}</h4>
                        <Separator className="my-2" />
                        <div>{renderCategory(categoryDetail)}</div>
                    </div>
                </ScrollArea>
                <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Đóng
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
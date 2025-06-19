"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash, Trash2 } from 'lucide-react';

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { GoPencil } from "react-icons/go";
import { IBlog } from '../../../../types/index';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/ui/Button";
import OverlayLoader from "@/components/atoms/feedback/OverlayLoader";



export function BlogColumns(onShowBlogPreview: (blog: IBlog) => void,
    onShowEditModal: (blog: IBlog) => void): ColumnDef<IBlog>[] {
    return [
        {
            accessorKey: "title",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tên Blog
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return <div>
                    <div className="flex items-center gap-x-2">
                        <p className="text-center truncate text-nowrap max-w-[300px]">{row.getValue("title")}</p>
                    </div>
                </div>
            }
        },
        {
            accessorKey: "thumbnail",
            header: "Thumbnail",
            cell: ({ row }) => {
                const blog = row.original;
                return (<Image
                    src={blog.thumbnail || ""}
                    alt={blog.slug || blog.title || "deo co alt"}
                    width={80}
                    height={80}
                    className="object-cover w-20 h-auto max-h-20"
                />)
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Ngày tạo
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },

            cell: ({ row }) => {
                return (
                    <p className="">{formatDate(row.getValue("createdAt"))}</p>
                );
            },
        },
        {
            id: "actions",
            header: "Trạng thái | Hành động",
            enableHiding: false,
            cell: ({ row }) => {
                const router = useRouter();
                const blog = row.original as IBlog;
                const [isLoading, setIsLoading] = useState(false);

                const handleDeleteClick = async () => {
                    setIsLoading(true);
                    try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/blog/${blog._id}`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })
                        if (res.ok) {
                            setIsLoading(false);
                            toast({
                                title: "Xóa blog thành công",
                                description: "Blog đã được xóa thành công.",
                            });
                        }
                    } catch (error) {
                        setIsLoading(false);
                        console.error("Error deleting blog:", error);
                        toast({
                            title: "Lỗi",
                            description: "Không thể xóa blog này.",
                            variant: "destructive",
                            duration: 2000
                        });

                        router.push("/admin/blog");
                    }
                }

                return (
                    <>
                        <div className="flex items-center gap-x-2">
                            <Button
                                onClick={handleDeleteClick}
                            >
                                <Trash2 />
                            </Button>
                            <Button
                                onClick={() => onShowBlogPreview(blog)}
                            >
                                <Eye />
                            </Button>
                            <Button
                                variant={"destructive"}
                                onClick={()=> onShowEditModal(blog)}
                            >
                                <GoPencil />
                            </Button>
                        </div>
                        {isLoading && (<OverlayLoader />)}
                    </>
                );
            },
        },
    ]
};
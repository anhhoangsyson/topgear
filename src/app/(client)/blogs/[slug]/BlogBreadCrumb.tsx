import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/atoms/ui/breadcrumb";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function BlogBreadcrumb({ title }: { title: string }) {
    return (
        <Breadcrumb className="flex flex-wrap items-center gap-2 text-sm">
            <BreadcrumbItem className="list-none">
                <BreadcrumbLink asChild>
                    <Link 
                        href="/" 
                        className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        <span className="hidden sm:inline">Trang chủ</span>
                    </Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="list-none">
                <ChevronRight className="w-4 h-4 text-gray-400" />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="list-none">
                <BreadcrumbLink asChild>
                    <Link 
                        href="/blogs" 
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        Blogs
                    </Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="list-none">
                <ChevronRight className="w-4 h-4 text-gray-400" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
                <BreadcrumbLink className="max-w-[200px] sm:max-w-[400px] truncate text-gray-900 font-medium">
                    {title}
                </BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
    );
}
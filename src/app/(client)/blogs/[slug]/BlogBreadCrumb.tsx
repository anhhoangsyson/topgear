import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import Link from "next/link";

export default function BlogBreadcrumb({ title }: { title: string }) {
    return (
        <Breadcrumb className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
            <BreadcrumbItem className="list-none">
                <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="list-none" />
            <BreadcrumbItem className="list-none">
                <BreadcrumbLink asChild>
                    <Link href="/blogs">Blogs</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="list-none" />
            <BreadcrumbItem>
                <BreadcrumbLink className="max-w-[300px] truncate inline-block align-bottom">{title}</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
    );
}
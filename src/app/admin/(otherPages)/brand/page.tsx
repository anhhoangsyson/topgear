import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { IBrand } from "@/types";
import { brandColumns } from "@/app/admin/(otherPages)/brand/brand-columns";
import { DataTable } from "@/components/common/data-table";



async function fetchBrands(): Promise<IBrand[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brand`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Products");
  }

  const data = await res.json();

  return data.data
}


export default async function BrandPage() {
  try {
    const data = await fetchBrands();
    return (
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between gap-x-8 mb-8">
          <h2 className="text-3xl text-black font-bold">Quản lý thương hiệu</h2>
          <Link
            href={'/admin/brand/add'}>
            <Button
            >
              Thêm thương hiệu phẩm mới
            </Button>
          </Link>
        </div>
        <DataTable
          columns={brandColumns}
          data={data}
          searchBy="name"
        />

      </div>
    )
  } catch (error) {
    console.log(error, "error");
    return (
      <div className="container mx-auto py-10">
        <p className="text-red-500">Không thể tải dữ liệu thương hiệu. Vui lòng thử lại sau.</p>
      </div>
    )

  }
}


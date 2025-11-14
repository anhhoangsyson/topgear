import Link from "next/link";
import { IVoucher } from "@/types";
import { voucherColumns } from "./voucher-columns";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/atoms/ui/Button";

async function fetchVouchers(): Promise<IVoucher[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/voucher`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch vouchers");
  }

  const data = await res.json();
  return data.data;
}

export default async function VoucherPage() {
  try {
    const data = await fetchVouchers();
    return (
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between gap-x-8 mb-8">
          <h2 className="text-3xl text-black font-bold">Quản lý Voucher</h2>
          <Link href="/admin/voucher/add">
            <Button>Thêm voucher mới</Button>
          </Link>
        </div>
        <DataTable
          columns={voucherColumns}
          data={data}
          searchBy="code"
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-red-500">
          Không thể tải dữ liệu voucher. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }
}

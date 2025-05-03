import { ProductsRes } from "@/types/Res/Product"
import { DataTable } from "@/app/admin/attributes/data-table"
import { productsColumns } from "@/app/admin/products/product-columns"
import { Button } from "@/components/ui/Button";
import Link from "next/link";

type Category = {
  _id: string;
  categoryName: string;
};

async function fetchProducts(): Promise<ProductsRes[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Products");
  }

  const { data } = await res.json();

  const categoryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/categories/parent`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!categoryRes.ok) {
    throw new Error("Failed to fetch categories");
  }

  const { data: categories } = await categoryRes.json();

  const abc = data.map((attr: any) => ({

    _id: attr._id,
    productName: attr.productName,
    categoriesId: attr.categoriesId || null,
    categoryName: categories.find((cat: Category) => cat._id === attr.categoriesId)?.categoryName || null,
    createdAt: attr.createdAt,
    updatedAt: attr.updatedAt,
  }));
  return abc;
}


export default async function ProductsPage() {
  try {
    const data = await fetchProducts();
    return (
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between gap-x-8 mb-8">
          <h2 className="text-3xl text-black font-bold">Quản lý các dòng sản phẩm của bạn</h2>
          <Link
            href={'/admin/products/add'}>
            <Button
            >
              Thêm dòng sản phẩm mới
            </Button>
          </Link>
        </div>
        <DataTable
          columns={productsColumns}
          data={data}
          searchBy="productName"
        />

      </div>
    )
  } catch (error) {
    console.log(error, "error");
    return (
      <div className="container mx-auto py-10">
        <p className="text-red-500">Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.</p>
      </div>
    )

  }
}


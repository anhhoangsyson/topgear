import { columns, AttributeRes } from "@/app/admin/attributes/columns";
import { DataTable } from "@/app/admin/attributes/data-table";
import WrapModal from "@/components/common/WrapModal";
import { Button } from "@/components/ui/Button";
import React from "react";

type Category = {
  _id: string;
  categoryName: string;
};

async function fetchAttributes(): Promise<AttributeRes[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/attribute`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch attributes");
  }

  const { data } = await res.json();


  const categoryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/categories/parent`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
    next: { revalidate: 3600 },
  });

  if (!categoryRes.ok) {
    throw new Error("Failed to fetch categories");
  }

  const { data: categories } = await categoryRes.json();

  const abc = data.map((attr: any) => ({

    _id: attr._id,
    attributeName: attr.attributeName,
    categoryIds: attr.categoryIds || [],
    isActive: attr.isActive,
    categoryNames: attr.categoryIds
      ?.map((id: string) =>
        categories.find((cat: Category) => cat._id === id)?.categoryName
      )
      .filter((name: string | undefined) => name) || [],
    createdAt: attr.createdAt,
    updatedAt: attr.updatedAt,
  }));

  return abc;
}

export default async function AttributesPage() {
  try {
    const data = await fetchAttributes();

    return (
      <div className="container mx-auto py-10">

        <DataTable columns={columns} data={data} />

      </div>
    );
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return (
      <div className="container mx-auto py-10">
        <p className="text-red-500">Không thể tải dữ liệu thuộc tính. Vui lòng thử lại sau.</p>
      </div>
    );
  }
}
import DetailProductPage from "@/components/productDetail";
import { ProductVariantDetail } from "@/types";

async function fetchProductVariant(id: string) {
  const res = await fetch(
    `https://top-gear-be.vercel.app/api/v1/pvariants/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60, // cache lại 60s
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product variant");
  }

  const productVariant = await res.json();
  return productVariant[0];
}

export default async function DetailProducts({
  params,
}: {
  params: { id: string };
}) {
  const productVariant: ProductVariantDetail = await fetchProductVariant(
    params.id
  );
  return <DetailProductPage data={productVariant} />;
}

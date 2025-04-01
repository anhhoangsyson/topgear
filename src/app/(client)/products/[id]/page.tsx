import DetailProductPage from "@/components/productDetail";
import { ProductVariantDetail } from "@/types";

async function fetchProductVariant(id: string) {
  const res = await fetch(`http://localhost:3000/api/v1/pvariants/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  const productVariant = await res.json();
  if (!res.ok) {
    throw new Error("Failed to fetch product variant");
  }
  return productVariant[0]
}
export default async function DetailProducts({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productVariant: ProductVariantDetail = await fetchProductVariant(id);
  return <DetailProductPage data={productVariant} />;
};


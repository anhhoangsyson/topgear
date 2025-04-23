import Loading from "@/app/(client)/products/[id]/Loading";
import DetailProductPage from "@/components/productDetail";
import { ProductVariantDetail } from "@/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function fetchProductVariant(id: string) {
  const res = await fetch(
    `https://top-gear-be.vercel.app/api/v1/pvariants/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 3600, // cache lại 3600s = 1h
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product variant");
  }

  const productVariant = await res.json();
  return productVariant[0];
}

export async function generateMetadata({
  params
}: {
  params: { id: string }
}) {
  try {
    const productVariant: ProductVariantDetail = await fetchProductVariant(params.id);
    return {
      title: `${productVariant.variantName} - Top Gear`,
      description: productVariant.variantName ||
        `Khám phá ${productVariant.variantName} tại Top Gear với giá ưu đãi.`,
      openGraph: {
        title: `${productVariant.variantName} - Top Gear`,
        description: productVariant.variantName,
        url: `https://top-gear.vercel.app/products/${params.id}`,
        images: [
          {
            url: productVariant.images[0].imageUrl,
            width: 800,
            height: 600,
          },
        ],
      },
      robots: 'index, follow',
      alternates: {
        canonical: `https://top-gear.vercel.app/products/${params.id}`,
      },

    }

  } catch (error) {
    return {
      title: "Sản phẩm không tồn tại",
    }
  }
}

export default async function DetailProducts({
  params,
}: {
  params: { id: string };
}) {
  try {
    const productVariant: ProductVariantDetail = await fetchProductVariant(params.id);
    if (!productVariant) {
      return notFound();
    }
    return (
      <Suspense fallback={<Loading />}  >
        <DetailProductPage data={productVariant} />;
      </Suspense>
    )
  } catch (error) {
    console.log('error', error);

    notFound();
  }

}

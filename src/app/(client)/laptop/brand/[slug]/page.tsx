import { redirect } from 'next/navigation';

export default async function LaptopsByBrandPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // Redirect to unified /laptop page with brand filter
    redirect(`/laptop?brand=${slug}`);
}

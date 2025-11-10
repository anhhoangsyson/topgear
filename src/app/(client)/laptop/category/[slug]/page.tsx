import { redirect } from 'next/navigation';

export default async function LaptopsByCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // Redirect to unified /laptop page with category filter
    redirect(`/laptop?category=${slug}`);
}

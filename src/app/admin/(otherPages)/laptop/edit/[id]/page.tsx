import EditLaptopForm from '@/app/admin/(otherPages)/laptop/edit/[id]/EditLaptopForm'
import NotFound from '@/app/not-found';
import React, { Suspense } from 'react'


export default async function EditLaptopPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/laptop/${id}`, {
            method: 'GET',
        })
        const data = await res.json();
        const laptop = data.data;
        if (laptop && res.ok) {
            return (
                <div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <EditLaptopForm
                            laptop={laptop}
                        />
                    </Suspense>
                </div>
            )
        }
        else {
            return NotFound();
        }
    } catch (error) {
        console.error('Error fetching laptop:', error);
    }

}

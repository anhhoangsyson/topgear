import DashBoard from '@/app/admin/(otherPages)/dashboard/DashBoard';
import React from 'react'

async function fetDashBoardSumary() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/admin/dashboard/summary`, {
            method: 'GET',
        })
        if (!res.ok) throw new Error('Failed to fetch dashboard summary');

        const data = await res.json()
        
        return data
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        return null;

    }
}

export default async function page() {
    const data = await fetDashBoardSumary();

    if (!data) return <div>Error loading dashboard data</div>;

    return (
        <div>
            <DashBoard data={data} />
        </div>
    )
}

import AddLaptopGroupForm from '@/app/admin/(otherPages)/laptop-group/add/AddLaptopGroupForm';
import React from 'react'

async function fetchLaptops() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/laptop`, {
            method: "GET",
        })

        if (!res.ok) {
            return []
        }

        const data = await res.json();
        return data?.data || []
    } catch (err) {
        // If the backend is down during prerender, return empty list to avoid build failure
        return []
    }
}


export default async function page() {
    const laptops = await fetchLaptops();

    return (
        <AddLaptopGroupForm
            laptops={laptops}
        />
    )
}

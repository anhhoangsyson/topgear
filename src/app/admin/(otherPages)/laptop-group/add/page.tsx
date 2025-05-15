import AddLaptopGroupForm from '@/app/admin/(otherPages)/laptop-group/add/AddLaptopGroupForm';
import React from 'react'

async function fetchLaptops() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/laptop`, {
        method: "GET",
    })

    const data = await res.json();
    return data.data
}


export default async function page() {
    const laptops = await fetchLaptops();

    return (
        <AddLaptopGroupForm
            laptops={laptops}
        />
    )
}

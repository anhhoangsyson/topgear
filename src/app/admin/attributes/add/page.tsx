import AddAttributeForm from '@/app/admin/attributes/add/AddAttributeForm'
import React from 'react'

async function fetchCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/categories/parent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!res.ok) {
      throw new Error('Network response was not ok')
    }

    const { data } = await res.json()
    return data
  } catch (error) {
    console.log('Error fetching categories:', error);
  }
}
const categories = await fetchCategories()


export default async function AddAttributePage() {

  return (
    <div className='h-screen'>
      <AddAttributeForm cats={categories} />
    </div>
  )
}

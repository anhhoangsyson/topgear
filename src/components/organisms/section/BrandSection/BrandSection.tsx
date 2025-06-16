import BrandCard from '@/components/organisms/section/BrandSection/BrandCard'
import SectionWrapper from '@/components/organisms/section/SectionWrapper'
import { IBrand } from '@/types'
import React from 'react'


export default function BrandSection({ brands }: { brands: IBrand[] }) {

  return (
    <SectionWrapper>
      <h2 className="text-2xl font-bold mb-6 text-left my-4">Thương hiệu laptop</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center py-4">
        {brands.map((brand) => (
          <BrandCard key={brand._id} brand={brand} />
        ))}
      </div>
    </SectionWrapper>
  )
}

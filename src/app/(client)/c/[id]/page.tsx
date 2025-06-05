'use client';
import { use } from 'react';
import FilterProduct from '@/components/FilterProduct';
import ProductCard from '@/components/home/ProductCard';
import React, { useEffect, useState } from 'react';

interface IProductVariantDetailRes {
  _id: string;
  variantName: string,
  variantStock: number,
  variantPrice: number,
  variantPriceSale: number,
  images: [
    {
      imageUrl: string;
    }
  ]
};


export default function ProductByCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [productsData, setProductsData] = useState<IProductVariantDetailRes[]>([]);
  // const [filterData, setFilterData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch initial data khi id thay đổi
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy danh sách sản phẩm
        const productsResponse = await fetch(
          `https://top-gear-be.vercel.app/api/v1/pvariants/pvariantsByChildId/${id}`
        );
        const products = await productsResponse.json();
        setProductsData(products.data);

        // Lấy dữ liệu filter
        // const filtersResponse = await fetch(
        // `https://top-gear-be.vercel.app/api/v1/categories/categoriesByChildId/${id}`
        // );
        // const filters = await filtersResponse.json();

        // setFilterData(filters.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hàm xử lý filter và cập nhật lại sản phẩm
  const handleFilter = async (filter: Record<string, boolean>) => {
    setLoading(true);
    try {
      const filterKeys = Object.keys(filter);


      const res = await fetch(`https://top-gear-be.vercel.app/api/v1/pvariants/filter/?${filterKeys.map((key) => `filterData=${key}`).join('&')}`);
      const data = await res.json();
      setProductsData(data.data); // Cập nhật lại danh sách sản phẩm
    } catch (error) {
      console.error('Error filtering products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex w-screen  max-w-none'>
      <div
        className=''>
        <FilterProduct id={id} onFilter={handleFilter} />

      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-4 gap-x-3 gap-y-8 my-9">
          {productsData && productsData.length > 0 ? (
            productsData.map((variant: IProductVariantDetailRes, index) => (
              <ProductCard key={`product-variant-${index}`} product={variant} />
            ))
          ) : (
            <p>Không tìm thấy sản phẩm nào phù hợp với yêu cầu của thượng đế.</p>
          )}
        </div>
      )}
    </div>
  );
}
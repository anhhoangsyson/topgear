export type ProductsRes = {
  _id: string;
  productName: string;
  categoriesId: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductsVariantsRes = {
  _id: string;
  productName: string;
  variantPrice: number;
  variantPriceSale: number;
  variantStock: number;
  status: boolean;
  thumbnail: string;
  variantName: string;
  createdAt: string;
}
interface Product {
  imageUrl?: string | StaticImageData;
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: StaticImageData;
  category: string;
  isAvailable: boolean;
}

interface ProductRelated {
  id: number;
  name: string;
  price: string;
  imageUrl: string | StaticImport;
}

type ProductData = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

interface Category {
  id: number;
  label: string;
  link: string;
}

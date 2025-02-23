interface Category {
  id: string;
  name: string;
}

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

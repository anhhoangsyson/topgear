import ProductCard from "./CardProductRalated";
import img1 from "/public/Laptop-ASUS-Vivobook-14-X1404-ZA-NK389.png";

export const products: ProductRelated[] = [
  {
    id: 1,
    name: "Laptop ASUS Vivobook 14",
    price: "15.590.000 VND",
    imageUrl: img1,
  },
  {
    id: 2,
    name: "Laptop ASUS Vivobook 14",
    price: "15.590.000 VND",
    imageUrl: img1,
  },
  {
    id: 3,
    name: "Laptop ASUS Vivobook 14",
    price: "15.590.000 VND",
    imageUrl: img1,
  },
  {
    id: 4,
    name: "Laptop ASUS Vivobook 14",
    price: "15.590.000 VND",
    imageUrl: img1,
  },
  {
    id: 5,
    name: "Laptop ASUS Vivobook 14",
    price: "15.590.000 VND",
    imageUrl: img1,
  },
  {
    id: 6,
    name: "Laptop ASUS Vivobook 14",
    price: "15.590.000 VND",
    imageUrl: img1,
  },
  {
    id: 7,
    name: "Laptop ASUS Vivobook 14",
    price: "15.590.000 VND",
    imageUrl: img1,
  },
];

export const ListRelatedProduct = () => {
  return (
    <div className="mt-[80px]">
      <h2 className="text-[#1F2937] font-bold mb-4 text-xl">
        Sản phẩm liên quan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

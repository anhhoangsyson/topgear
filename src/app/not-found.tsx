// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto p-4 text-center mt-16">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - NOT FOUND</h1>
      <p className="text-gray-500 mb-6">
        Trang hoặc sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-blue-500 text-white rounded-md uppercase"
        >
          Về trang chủ
        </Link>
        <Link
          href="/products?page=1"
          className="px-6 py-3 bg-gray-300 text-black rounded-md uppercase"
        >
          Xem sản phẩm
        </Link>
      </div>
    </div>
  );
}
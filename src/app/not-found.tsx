import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/atoms/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8 relative">
          <div className="text-9xl sm:text-[12rem] font-bold text-gray-200 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-blue-100 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 sm:w-20 sm:h-20 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trang không tìm thấy
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Xin lỗi, trang hoặc sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Có thể URL không chính xác hoặc trang đã được di chuyển.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Home className="w-4 h-4 mr-2" />
                Về trang chủ
              </Button>
            </Link>
            
            <Link href="/laptop" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:px-8 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold"
              >
                <Search className="w-4 h-4 mr-2" />
                Xem sản phẩm
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Bạn có thể thử:</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link 
                href="/blogs" 
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Xem blog
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                href="/lien-he" 
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Liên hệ
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                href="/account" 
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Tài khoản
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
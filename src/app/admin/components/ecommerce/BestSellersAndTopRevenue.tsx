import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";

interface BestSeller {
  productId: string;
  name: string;
  sold: number;
}
interface TopRevenueProduct {
  productId: string;
  name: string;
  revenue: number;
}

export default function BestSellersAndTopRevenue({
  bestSellers,
  topRevenueProduct,
}: {
  bestSellers: BestSeller[];
  topRevenueProduct: TopRevenueProduct;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm bán chạy</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {bestSellers.map((item, idx) => (
              <li key={item.productId} className="flex justify-between items-center">
                <span className="font-medium">{idx + 1}. {item.name}</span>
                <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-semibold">{item.sold} đã bán</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu cao nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <span className="font-medium">{topRevenueProduct?.name || 'Không có sản phẩm'}</span>
            <span className="text-green-600 font-bold text-lg">
              {topRevenueProduct?.revenue?.toLocaleString("vi-VN") || 0} đ
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/app/admin/components/ecommerce/table";
import { formatOrderStatus } from '../../../../lib/utils';
import { Badge } from "@/components/atoms/ui/badge";

// Define the TypeScript interface for the table rows
interface OrderRow {
  id: number; // Unique identifier for each order
  name: string; // Order name
  variants: string; // Number of variants (e.g., "1 Variant", "2 Variants")
  category: string; // Category of the order
  price: string; // Price of the product (as a string with currency symbol)
  // status: string; // Status of the product
  image: string; // URL or path to the product image
  status: "Delivered" | "Pending" | "Canceled"; // Status of the product
}

interface RecentOrder {
  _id: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  user: {
    fullname: string;
    email: string;
  };
  products: string[]; // hoặc có thể là object nếu bạn muốn chi tiết hơn
}

interface RecentOrdersProps {
  recentOrders: RecentOrder[];
}

function getStatusLabel(status: string) {
  if (status === "completed") return { label: "Delivered", color: "success" };
  if (status === "pending") return { label: "Pending", color: "warning" };
  if (status === "canceled") return { label: "Canceled", color: "error" };
  return { label: status, color: "default" };
}

export default function RecentOrders({ recentOrders }: RecentOrdersProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Orders
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button> */}
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Order ID</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Khách hàng</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tổng giá trị đơn hàng</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Ngày đặt</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentOrders.map((order) => {
              const status = getStatusLabel(order.orderStatus);
              return (
                <TableRow key={order._id}>
                  <TableCell className="py-3">{order._id}</TableCell>
                  <TableCell className="py-3">
                    <div>
                      <div className="font-medium">{order.user.fullname}</div>
                      <div className="text-xs text-gray-400">{order.user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-green-600 font-semibold">{order.totalAmount.toLocaleString()} đ</TableCell>
                  <TableCell className="py-3">
                    <Badge color={status.color}>
                      {formatOrderStatus(order.orderStatus)}
                      </Badge>
                  </TableCell>
                  <TableCell className="py-3">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

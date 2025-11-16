"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Eye, Trash2 } from "lucide-react"
// Local display type for the product list (sample/demo data)
type ProductRow = {
  id: string;
  productName: string;
  category: string;
  variants: number;
  createdAt: string;
}
import { Badge } from "@/components/atoms/ui/badge"
import { Button } from "@/components/atoms/ui/Button"
import { Table, TableHead } from "@/components/atoms/ui/table"
import { TableBody, TableCell, TableHeader, TableRow } from "@/app/admin/components/ecommerce/table"

// Mẫu dữ liệu sản phẩm - Trong thực tế, số biến thể sẽ được tính từ cơ sở dữ liệu
const sampleProducts = [
  {
    id: "1",
    productName: "Laptop Acer Nitro 5",
    category: "Laptop",
    variants: 2,
    createdAt: "2023-10-15",
  },
  {
    id: "2",
    productName: "iPhone 15 Pro",
    category: "Điện thoại",
    variants: 4,
    createdAt: "2023-10-10",
  },
]

export default function ProductList() {
  const [products, setProducts] = useState<ProductRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Giả lập tải dữ liệu
    setTimeout(() => {
      setProducts(sampleProducts as ProductRow[])
      setIsLoading(false)
    }, 500)
  }, [])

  if (isLoading) {
    return <div className="flex justify-center py-10">Đang tải dữ liệu...</div>
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">Chưa có sản phẩm nào.</p>
        <Link href="/products/add">
          <Button>Thêm sản phẩm mới</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên sản phẩm</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Số biến thể</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.productName}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                <Badge variant="outline">{product.variants}</Badge>
              </TableCell>
              <TableCell>{product.createdAt}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


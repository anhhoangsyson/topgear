import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { PlusCircle } from "lucide-react"
import ProductList from "@/app/admin/components/ui/form/productList"

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Danh sách sản phẩm</h1>
        <Link href="/products/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm sản phẩm mới
          </Button>
        </Link>
      </div>

      <ProductList />
    </div>
  )
}


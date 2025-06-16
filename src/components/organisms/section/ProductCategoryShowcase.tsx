import Image from "next/image"
import Link from "next/link"

type CategoryItem = {
  id: string
  name: string
  image: string
  isHot?: boolean
  href: string
}

interface ProductCategoriesProps {
  categories: CategoryItem[]
}

export default function ProductCategoryShowcase({ categories }: ProductCategoriesProps) {
  return (
    <div className="w-full border border-gray-200 rounded-lg p-4 bg-white">
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={category.href} className="flex flex-col items-center group">
            <div className="relative mb-2">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                width={64}
                height={64}
                className="object-contain"
              />
              {category.isHot && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded">HOT</span>
              )}
            </div>
            <span className="text-sm text-center group-hover:text-primary transition-colors">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

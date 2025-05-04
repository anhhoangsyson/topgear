import { Badge } from '@/components/ui/badge';
import React from 'react'

const CategoryTags = ({ categories }
    : { categories: { categoryId: string, categoryName: string }[] }
) => (
    <div>
        <h3 className="font-semibold mb-2">Danh mục áp dụng</h3>
        <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
                <Badge key={cat.categoryId} variant="outline">
                    {cat.categoryName}
                </Badge>
            ))}
        </div>
    </div>
);

export default CategoryTags

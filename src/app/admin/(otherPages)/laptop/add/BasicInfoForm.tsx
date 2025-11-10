"use client";

import { Checkbox } from "@/components/atoms/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/ui/select";
import { Textarea } from "@/components/atoms/ui/textarea";
import { useFormContext } from "react-hook-form";



import { IBrand, ICategory } from '@/types';

interface BasicInfoFormProps {
  brands: IBrand[];
  categories: ICategory[];
  data?:{
    name: string,
    modelName: string,
  }  
}


export default function BasicInfoForm({ brands, categories, data: _data }: BasicInfoFormProps) {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sản phẩm</FormLabel>
              <FormControl>
                <Input
                placeholder="Nhập tên sản phẩm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="modelName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input
                placeholder="Nhập model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="brandId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thương hiệu</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thương hiệu" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand._id} value={brand._id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá (VND)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập giá sản phẩm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="discountPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá khuyến mãi (VND)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập giá khuyến mãi (nếu có)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số lượng tồn kho</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập số lượng tồn kho"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="warranty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bảo hành (tháng)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập thời gian bảo hành"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái sản phẩm</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="new">Mới</SelectItem>
                  <SelectItem value="refurbished">Tân trang</SelectItem>
                  <SelectItem value="used">Đã qua sử dụng</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="releaseYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Năm sản xuất</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập năm sản xuất"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trọng lượng (kg)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Nhập trọng lượng"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="dimensions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kích thước (mm)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: 344 x 230 x 18 mm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Nhập mô tả sản phẩm"
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Hiển thị sản phẩm</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isPromoted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Sản phẩm nổi bật</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
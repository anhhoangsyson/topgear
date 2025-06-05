"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { ICategory } from "@/types";
import { Heading } from "@/components/ui/heading";
import { useCategoryStore } from "@/store/categoryStore";

const formSchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

type CategoryFormValues = z.infer<typeof formSchema> & {
  image?: string;
};


interface UpdateCategoryFormProps {
  category: CategoryFormValues & { _id: string };
  onClose: () => void;
  onUpdate?: () => void;
}

export const UpdateCategoryForm: React.FC<UpdateCategoryFormProps> = ({
  category,
  onClose,
  onUpdate,
}) => {
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    category.image || null
  );

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      description: category.description || "",
      parentId: category.parentId || null,
      image: category.image || undefined,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/top-level`);

        const data = await response.json();

        // const filteredCategories = response.data.data.filter(
        //   (category: Category) => category._id !== category._id
        // );
        setCategories(data.data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Có lỗi xảy ra",
          description: "Không thể tải danh sách danh mục. Vui lòng thử lại sau.",
        });
      }
    };

    fetchCategories();
  }, [category._id, toast]);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Thêm các trường khác vào FormData
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("parentId", data.parentId || "");
      formData.append("isActive", data.isActive.toString());
      formData.append("sortOrder", data.sortOrder.toString());


      // Nếu có file ảnh mới, upload lên Cloudinary
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${category._id}`, {
        method: "PUT",
        body: formData
      })


      if (!res.ok) {
        throw new Error("Không thể cập nhật danh mục");
      }


      toast({
        title: "Cập nhật thành công",
        description: `Danh mục "${data.name}" đã được cập nhật.`,
      });
      fetchCategories();
      onClose();
    } catch (error) {

      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: "Không thể cập nhật danh mục. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
      router.replace(`/admin/category`);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* <AlertDialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
        <div className="p-4">
          <p>Bạn có chắc chắn muốn xóa danh mục này?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={loading}>
              Xóa
            </Button>
          </div>
        </div>
      </AlertDialog> */}
      <div className="flex items-center justify-between w-full">
        <div className="py-4">
          <Heading
            title="Chỉnh sửa danh mục"
            description={`Chỉnh sửa thông tin danh mục: ${category.name}`}
          />
        </div>
        {/* <Button
          disabled={loading}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button> */}
      </div>
      {/* <Separator /> */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nhập tên danh mục"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục cha</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    defaultValue={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục cha (nếu có)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Không có danh mục cha</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id!}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Nhập mô tả danh mục"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thứ tự sắp xếp</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Nhập thứ tự sắp xếp"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem 
                className="flex gap-x-4 items-center"
                >
                  <FormLabel>Kích hoạt</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormLabel>Hình ảnh danh mục</FormLabel>
            <div className="mt-2 flex items-center gap-4">
              {imagePreview && (
                <div className="relative h-20 w-20">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Category preview"
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Tải ảnh lên
              </Button>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Lưu thay đổi
          </Button>
        </form>
      </Form>
    </>
  );
};
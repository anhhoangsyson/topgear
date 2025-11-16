"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { X, Upload, Plus } from 'lucide-react';
import Image from "next/image";
import { IImage, ISeoMetadata } from "@/types";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form";
import { Button } from "@/components/atoms/ui/Button";
import { Input } from "@/components/atoms/ui/input";
import { Separator } from "@/components/atoms/ui/separator";
import { Badge } from "@/components/atoms/ui/badge";
import { Textarea } from "@/components/atoms/ui/textarea";

interface SuggestedMetadata {
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  tags?: string[];
}

interface ImagesAndSeoFormProps {
  // Accept any shape for suggested metadata from different callers (keeps compatibility)
  suggestedMetadata: any | null;
  oldImages?: IImage[]
  isEditMode?: boolean;
}

export default function ImagesAndSeoForm({ suggestedMetadata, oldImages }: ImagesAndSeoFormProps) {

  const { control, setValue, watch } = useFormContext();
  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  const images = watch("images") || [];
  const altTexts = watch("altTexts") || [];
  const tags = watch("tags") || [];
  const keywords = watch("seoMetadata.keywords") || [];

  useEffect(() => {
    if (suggestedMetadata) {
      // Handle both shapes: { seoMetadata: { ... }, tags: [...] } or plain ISeoMetadata
      if ((suggestedMetadata as SuggestedMetadata).seoMetadata) {
        const s = (suggestedMetadata as SuggestedMetadata);
        setValue("seoMetadata.metaTitle", s.seoMetadata?.metaTitle || "");
        setValue("seoMetadata.metaDescription", s.seoMetadata?.metaDescription || "");
        setValue("seoMetadata.keywords", s.seoMetadata?.keywords || []);
        setValue("tags", s.tags || []);
      } else {
        const s = suggestedMetadata as ISeoMetadata;
        setValue("seoMetadata.metaTitle", s.metaTitle || "");
        setValue("seoMetadata.metaDescription", s.metaDescription || "");
        setValue("seoMetadata.keywords", s.keywords || []);
        setValue("tags", []);
      }
    }
  }, [suggestedMetadata, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = [...images, ...Array.from(files)];
      setValue("images", newImages);

      // Initialize altTexts for new images
      const newAltTexts = [...altTexts];
      for (let i = altTexts.length; i < newImages.length; i++) {
        newAltTexts.push("");
      }
      setValue("altTexts", newAltTexts);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue("images", newImages);

    const newAltTexts = [...altTexts];
    newAltTexts.splice(index, 1);
    setValue("altTexts", newAltTexts);
  };

  const handleAltTextChange = (index: number, value: string) => {
    const newAltTexts = [...altTexts];
    newAltTexts[index] = value;
    setValue("altTexts", newAltTexts);
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setValue("tags", [...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setValue("tags", tags.filter((t: string) => t !== tag));
  };

  const addKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      setValue("seoMetadata.keywords", [...keywords, newKeyword]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setValue(
      "seoMetadata.keywords",
      keywords.filter((k: string) => k !== keyword)
    );
  };

  return (
    <div className="space-y-6">
      {/* old imgs */}
      {oldImages && oldImages.length > 0 && (
        <div>
          <div className="font-semibold mb-2">Ảnh hiện tại:</div>
          <div className="flex gap-2 flex-wrap">
            {oldImages.map((img, idx) => (
              <div key={idx} className="relative">
                <Image
                  src={img.imageUrl}
                  alt={img.altText || "Ảnh laptop"}
                  width={80}
                  height={80}
                  className="rounded border object-cover"
                />
                {/* Nếu muốn cho phép xóa ảnh cũ, thêm nút xóa ở đây */}
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <h3 className="text-lg font-medium mb-4">Hình ảnh sản phẩm</h3>
        <FormField
          control={control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tải lên hình ảnh</FormLabel>
              <FormDescription>
                Tải lên ít nhất một hình ảnh cho sản phẩm. Hình ảnh đầu tiên sẽ được sử dụng làm ảnh chính.
              </FormDescription>
              <FormControl>
                <div className="flex items-center gap-4">
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
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {(images as File[]).map((file: File, index: number) => (
              <div key={index} className="relative border rounded-md p-2">
                <div className="relative h-32 w-full">
                  <Image
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="rounded-md object-cover"
                  />
                  {index === 0 && (
                    <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1 rounded-br">
                      Ảnh chính
                    </div>
                  )}
                </div>
                <Input
                  className="mt-2 text-sm"
                  placeholder="Mô tả hình ảnh"
                  value={altTexts[index] || ""}
                  onChange={(e) => handleAltTextChange(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {tag}
              <X
                className="h-3 w-3 ml-2 cursor-pointer"
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Thêm tag mới"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" onClick={addTag} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Thêm
          </Button>
        </div>
        {suggestedMetadata && suggestedMetadata.tags && suggestedMetadata.tags.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground mb-1">Tags được gợi ý:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedMetadata.tags.map((tag: string, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => {
                    if (!tags.includes(tag)) {
                      setValue("tags", [...tags, tag]);
                    }
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">SEO Metadata</h3>
        <div className="space-y-4">
          <FormField
            control={control}
            name="seoMetadata.metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tiêu đề SEO"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="seoMetadata.metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mô tả SEO"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Keywords</FormLabel>
            <div className="flex flex-wrap gap-2 mb-4">
              {keywords.map((keyword: string, index: number) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {keyword}
                  <X
                    className="h-3 w-3 ml-2 cursor-pointer"
                    onClick={() => removeKeyword(keyword)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Thêm keyword mới"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
              />
              <Button type="button" onClick={addKeyword} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Thêm
              </Button>
            </div>
            {suggestedMetadata && suggestedMetadata.seoMetadata?.keywords && suggestedMetadata.seoMetadata.keywords.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-1">Keywords được gợi ý:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedMetadata.seoMetadata.keywords.map((keyword: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => {
                        if (!keywords.includes(keyword)) {
                          setValue("seoMetadata.keywords", [...keywords, keyword]);
                        }
                      }}
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
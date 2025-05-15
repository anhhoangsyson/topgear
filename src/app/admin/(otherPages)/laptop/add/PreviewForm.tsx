"use client";

import { useFormContext } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface PreviewFormProps {
  brands: any[];
  categories: any[];
}

export default function PreviewForm({ brands, categories }: PreviewFormProps) {
  const { watch } = useFormContext();
  
  const formData = watch();
  const brandName = brands.find((b) => b._id === formData.brandId)?.name || "";
  const categoryName = categories.find((c) => c._id === formData.categoryId)?.name || "";
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-2">{formData.name}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline">{brandName}</Badge>
          <Badge variant="outline">{categoryName}</Badge>
          <Badge variant="outline">Model: {formData.modelName}</Badge>
          <Badge variant={formData.isActive ? "default" : "destructive"}>
            {formData.isActive ? "Hiển thị" : "Ẩn"}
          </Badge>
          {formData.isPromoted && (
            <Badge variant="secondary">Sản phẩm nổi bật</Badge>
          )}
        </div>
        
        {formData.images && formData.images.length > 0 && (
          <div className="grid grid-cols-5 gap-2 mb-4">
            {Array.from(formData.images).map((file: any, index: number) => (
              <div key={index} className="relative h-24 w-full">
                <Image
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt={formData.altTexts?.[index] || `Hình ảnh ${index + 1}`}
                  fill
                  className="rounded-md object-cover"
                />
                {index === 0 && (
                  <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1 rounded-br">
                    Ảnh chính
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Giá bán:</p>
            <p className="text-lg font-bold">
              {formatCurrency(formData.price)}
            </p>
            {formData.discountPrice && (
              <p className="text-sm line-through text-muted-foreground">
                {formatCurrency(formData.discountPrice)}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tình trạng:</p>
            <p>
              <Badge variant={
                formData.status === "new" 
                  ? "default" 
                  : formData.status === "refurbished" 
                  ? "secondary" 
                  : "outline"
              }>
                {formData.status === "new" 
                  ? "Mới" 
                  : formData.status === "refurbished" 
                  ? "Tân trang" 
                  : "Đã qua sử dụng"}
              </Badge>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tồn kho:</p>
            <p>{formData.stock} sản phẩm</p>
          </div>
          {formData.warranty && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bảo hành:</p>
              <p>{formData.warranty} tháng</p>
            </div>
          )}
          {formData.releaseYear && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Năm sản xuất:</p>
              <p>{formData.releaseYear}</p>
            </div>
          )}
          {formData.weight && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Trọng lượng:</p>
              <p>{formData.weight} kg</p>
            </div>
          )}
          {formData.dimensions && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Kích thước:</p>
              <p>{formData.dimensions}</p>
            </div>
          )}
        </div>
        
        {formData.description && (
          <div className="mb-4">
            <p className="text-sm font-medium text-muted-foreground mb-1">Mô tả:</p>
            <p className="text-sm whitespace-pre-line">{formData.description}</p>
          </div>
        )}
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-4">Thông số kỹ thuật</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">CPU & RAM</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Bộ xử lý:</div>
              <div>{formData.specifications.processor}</div>
              
              {formData.specifications.processorGen && (
                <>
                  <div className="text-muted-foreground">Thế hệ CPU:</div>
                  <div>{formData.specifications.processorGen}</div>
                </>
              )}
              
              {formData.specifications.processorSpeed && (
                <>
                  <div className="text-muted-foreground">Tốc độ CPU:</div>
                  <div>{formData.specifications.processorSpeed} GHz</div>
                </>
              )}
              
              <div className="text-muted-foreground">RAM:</div>
              <div>{formData.specifications.ram} GB</div>
              
              {formData.specifications.ramType && (
                <>
                  <div className="text-muted-foreground">Loại RAM:</div>
                  <div>{formData.specifications.ramType}</div>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Lưu trữ & Đồ họa</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Bộ nhớ:</div>
              <div>{formData.specifications.storage} GB</div>
              
              {formData.specifications.storageType && (
                <>
                  <div className="text-muted-foreground">Loại ổ cứng:</div>
                  <div>{formData.specifications.storageType}</div>
                </>
              )}
              
              {formData.specifications.graphicsCard && (
                <>
                  <div className="text-muted-foreground">Card đồ họa:</div>
                  <div>{formData.specifications.graphicsCard}</div>
                </>
              )}
              
              {formData.specifications.graphicsMemory && (
                <>
                  <div className="text-muted-foreground">Bộ nhớ đồ họa:</div>
                  <div>{formData.specifications.graphicsMemory} GB</div>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Màn hình</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Kích thước:</div>
              <div>{formData.specifications.displaySize} inch</div>
              
              {formData.specifications.displayResolution && (
                <>
                  <div className="text-muted-foreground">Độ phân giải:</div>
                  <div>{formData.specifications.displayResolution}</div>
                </>
              )}
              
              {formData.specifications.displayType && (
                <>
                  <div className="text-muted-foreground">Loại màn hình:</div>
                  <div>{formData.specifications.displayType}</div>
                </>
              )}
              
              {formData.specifications.refreshRate && (
                <>
                  <div className="text-muted-foreground">Tần số quét:</div>
                  <div>{formData.specifications.refreshRate} Hz</div>
                </>
              )}
              
              <div className="text-muted-foreground">Cảm ứng:</div>
              <div>{formData.specifications.touchscreen ? "Có" : "Không"}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Pin & Hệ điều hành</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {formData.specifications.battery && (
                <>
                  <div className="text-muted-foreground">Pin:</div>
                  <div>{formData.specifications.battery}</div>
                </>
              )}
              
              {formData.specifications.batteryLife && (
                <>
                  <div className="text-muted-foreground">Thời lượng pin:</div>
                  <div>{formData.specifications.batteryLife} giờ</div>
                </>
              )}
              
              {formData.specifications.operatingSystem && (
                <>
                  <div className="text-muted-foreground">Hệ điều hành:</div>
                  <div>{formData.specifications.operatingSystem}</div>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-2 col-span-1 md:col-span-2">
            <h4 className="font-medium">Kết nối & Khác</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {formData.specifications.ports && formData.specifications.ports.length > 0 && (
                <>
                  <div className="text-muted-foreground">Cổng kết nối:</div>
                  <div>{formData.specifications.ports.join(", ")}</div>
                </>
              )}
              
              {formData.specifications.webcam && (
                <>
                  <div className="text-muted-foreground">Webcam:</div>
                  <div>{formData.specifications.webcam}</div>
                </>
              )}
              
              {formData.specifications.keyboard && (
                <>
                  <div className="text-muted-foreground">Bàn phím:</div>
                  <div>{formData.specifications.keyboard}</div>
                </>
              )}
              
              {formData.specifications.speakers && (
                <>
                  <div className="text-muted-foreground">Loa:</div>
                  <div>{formData.specifications.speakers}</div>
                </>
              )}
              
              {formData.specifications.connectivity && (
                <>
                  <div className="text-muted-foreground">Kết nối không dây:</div>
                  <div>{formData.specifications.connectivity}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-4">Tags & SEO</h3>
        {formData.tags && formData.tags.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {formData.seoMetadata && (
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Meta Title:</p>
              <p className="text-sm">{formData.seoMetadata.metaTitle}</p>
            </div>
            
            {formData.seoMetadata.metaDescription && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Meta Description:</p>
                <p className="text-sm">{formData.seoMetadata.metaDescription}</p>
              </div>
            )}
            
            {formData.seoMetadata.keywords && formData.seoMetadata.keywords.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Keywords:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.seoMetadata.keywords.map((keyword: string, index: number) => (
                    <Badge key={index} variant="outline">{keyword}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function SpecificationsForm() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">CPU & RAM</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="specifications.processor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bộ xử lý (CPU)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: Intel Core i7-12700H"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.processorGen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thế hệ CPU</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: 12th Gen"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.processorSpeed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tốc độ CPU (GHz)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ví dụ: 4.7"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.ram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RAM (GB)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ví dụ: 16"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.ramType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại RAM</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: DDR5"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <h3 className="text-lg font-medium">Lưu trữ & Đồ họa</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="specifications.storage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bộ nhớ (GB)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ví dụ: 512"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.storageType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại ổ cứng</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: SSD"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.graphicsCard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card đồ họa</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: NVIDIA GeForce RTX 3050 Ti"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.graphicsMemory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bộ nhớ đồ họa (GB)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ví dụ: 4"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <h3 className="text-lg font-medium">Màn hình</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="specifications.displaySize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kích thước màn hình (inch)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ví dụ: 15.6"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.displayResolution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Độ phân giải màn hình</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: 1920 x 1080"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.displayType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại màn hình</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: IPS, OLED"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.refreshRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tần số quét (Hz)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ví dụ: 60, 144"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.touchscreen"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Màn hình cảm ứng</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <h3 className="text-lg font-medium">Pin & Hệ điều hành</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="specifications.battery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pin</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: 86Whr"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.batteryLife"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời lượng pin (giờ)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.5"
                  placeholder="Ví dụ: 8"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.operatingSystem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hệ điều hành</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: Windows 11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <h3 className="text-lg font-medium">Kết nối & Khác</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="specifications.ports"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cổng kết nối</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: USB-C, HDMI, Thunderbolt"
                  value={field.value?.join(", ") || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? value.split(",").map(item => item.trim()) : []);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.webcam"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Webcam</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: HD 720p"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.keyboard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bàn phím</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: Backlit"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.speakers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loa</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: Stereo speakers"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specifications.connectivity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kết nối không dây</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: Wi-Fi 6, Bluetooth 5.2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
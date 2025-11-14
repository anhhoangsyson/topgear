"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/atoms/ui/input";
import { Button } from "@/components/atoms/ui/Button";
import OverlayLoader from "@/components/atoms/feedback/OverlayLoader";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/ui/select";
import { voucherApi } from "@/services/voucher-api";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  code: z.string().optional(),
  type: z.enum(["code", "auto"], {
    required_error: "Vui lòng chọn loại voucher",
  }),
  expiredDate: z.string().min(1, { message: "Ngày hết hạn không được để trống" }),
  pricePercent: z.coerce
    .number()
    .min(0, { message: "Phần trăm giảm giá phải >= 0" })
    .max(100, { message: "Phần trăm giảm giá phải <= 100" }),
  priceOrigin: z.coerce
    .number()
    .min(0, { message: "Giá trị giảm giá phải >= 0" }),
  minPrice: z.coerce
    .number()
    .min(0, { message: "Giá trị đơn hàng tối thiểu phải >= 0" }),
  maxUsage: z.coerce
    .number()
    .min(1, { message: "Số lượng sử dụng tối đa phải >= 1" }),
  maxDiscountAmount: z.coerce
    .number()
    .min(0, { message: "Số tiền giảm tối đa phải >= 0" })
    .optional(),
  status: z.enum(["active", "inactive"]).default("active"),
}).refine(
  (data) => {
    // If type is 'code', then 'code' field must be provided
    if (data.type === "code" && !data.code) {
      return false;
    }
    return true;
  },
  {
    message: "Mã voucher không được để trống khi loại là 'Mã giảm giá'",
    path: ["code"],
  }
);

export default function AddVoucherForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      type: "code",
      expiredDate: "",
      pricePercent: 0,
      priceOrigin: 0,
      status: "active",
    },
  });

  const voucherType = form.watch("type");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const voucherData = {
        ...values,
        expiredDate: new Date(values.expiredDate).toISOString(),
        code: values.type === "auto" ? undefined : values.code,
      };

      await voucherApi.createVoucher(voucherData);

      toast({
        title: "Tạo voucher thành công",
        variant: "default",
        duration: 2000,
      });

      // Redirect to voucher list page
      router.push("/admin/voucher");
      router.refresh();
    } catch (error) {
      console.error("Error creating voucher:", error);
      toast({
        title: "Có lỗi xảy ra khi tạo voucher",
        description: error instanceof Error ? error.message : "Vui lòng thử lại sau",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-8 w-full max-w-2xl" onSubmit={form.handleSubmit(onSubmit)}>
        <h2>
          <span className="text-2xl font-bold text-gray-800 mb-8">Tạo Voucher</span>
        </h2>

        {/* Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại voucher</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại voucher" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="code">Mã giảm giá</SelectItem>
                  <SelectItem value="auto">Tự động</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {voucherType === "code"
                  ? "Khách hàng cần nhập mã để áp dụng giảm giá"
                  : "Giảm giá được áp dụng tự động"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Code (only show if type is 'code') */}
        {voucherType === "code" && (
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã voucher</FormLabel>
                <FormControl>
                  <Input placeholder="SUMMER2024" {...field} />
                </FormControl>
                <FormDescription>Mã voucher duy nhất (không trùng lặp)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Price Percent */}
        <FormField
          control={form.control}
          name="pricePercent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phần trăm giảm giá (%)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="20" {...field} />
              </FormControl>
              <FormDescription>Giá trị từ 0 đến 100</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Origin */}
        <FormField
          control={form.control}
          name="priceOrigin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá trị giảm cố định (VND)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="50000" {...field} />
              </FormControl>
              <FormDescription>
                Số tiền giảm giá cố định (nếu không dùng phần trăm)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Min Price */}
        <FormField
          control={form.control}
          name="minPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá trị đơn hàng tối thiểu (VND)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="999999" {...field} />
              </FormControl>
              <FormDescription>
                💡 Đơn hàng phải LỚN HƠN giá trị này (không bằng). VD: set 999,999 cho "từ 1 triệu"
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Usage */}
        <FormField
          control={form.control}
          name="maxUsage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số lượng sử dụng tối đa</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100" {...field} />
              </FormControl>
              <FormDescription>
                Số lần voucher có thể được sử dụng
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Discount Amount (only for percentage discount) */}
        <FormField
          control={form.control}
          name="maxDiscountAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tiền giảm tối đa (VND)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5000000" {...field} />
              </FormControl>
              <FormDescription>
                💡 Chỉ áp dụng với giảm theo %. Để 0 nếu không giới hạn
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Expired Date */}
        <FormField
          control={form.control}
          name="expiredDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày hết hạn</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </FormControl>
              <FormDescription>Voucher sẽ hết hạn sau ngày này</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang tạo..." : "Tạo voucher"}
        </Button>

        {isLoading && <OverlayLoader />}
      </form>
    </Form>
  );
}

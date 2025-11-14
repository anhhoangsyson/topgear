"use client";

import { Button } from "@/components/atoms/ui/Button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/ui/select";
import { toast } from "@/hooks/use-toast";
import { IVoucher } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { voucherApi } from "@/services/voucher-api";

const formSchema = z
  .object({
    code: z.string().optional(),
    type: z.enum(["code", "auto"]),
    expiredDate: z.string().min(1, { message: "Ngày hết hạn không được để trống" }),
    pricePercent: z.coerce
      .number()
      .min(0, { message: "Phần trăm giảm giá phải >= 0" })
      .max(100, { message: "Phần trăm giảm giá phải <= 100" }),
    priceOrigin: z.coerce
      .number()
      .min(0, { message: "Giá trị đơn hàng tối thiểu phải >= 0" }),
    status: z.enum(["active", "inactive"]),
  })
  .refine(
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

type UpdateVoucherFormProps = {
  voucher: IVoucher;
  onClose: () => void;
};

export default function UpdateVoucherForm({
  voucher,
  onClose,
}: UpdateVoucherFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: voucher.code || "",
      type: voucher.type,
      expiredDate: new Date(voucher.expiredDate).toISOString().slice(0, 16),
      pricePercent: voucher.pricePercent,
      priceOrigin: voucher.priceOrigin,
      status: voucher.status,
    },
  });

  const voucherType = form.watch("type");

  useEffect(() => {
    form.reset({
      code: voucher.code || "",
      type: voucher.type,
      expiredDate: new Date(voucher.expiredDate).toISOString().slice(0, 16),
      pricePercent: voucher.pricePercent,
      priceOrigin: voucher.priceOrigin,
      status: voucher.status,
    });
  }, [voucher, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const updateData = {
        ...values,
        expiredDate: new Date(values.expiredDate).toISOString(),
        code: values.type === "auto" ? undefined : values.code,
      };

      await voucherApi.updateVoucher(voucher._id, updateData);

      toast({
        title: "Cập nhật voucher thành công",
        variant: "default",
        duration: 2000,
      });

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating voucher:", error);
      toast({
        title: "Cập nhật voucher thất bại",
        description: error instanceof Error ? error.message : "Vui lòng thử lại sau",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormProvider {...form}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Cập nhật voucher</h2>
      <form
        className="w-[500px] space-y-6 mx-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
              <FormLabel>Giá trị đơn hàng tối thiểu (VND)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100000" {...field} />
              </FormControl>
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
                />
              </FormControl>
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

        <Button
          disabled={loading}
          type="submit"
          className="w-full"
          variant="default"
        >
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </form>
    </FormProvider>
  );
}

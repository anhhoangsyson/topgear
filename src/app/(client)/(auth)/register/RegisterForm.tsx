"use client";
import { SEX_LABELS } from "@/schemaValidations/auth.schema";
import {
  RegisterValidationSchema,
  RegisterType,
} from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/ui/Button";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Cấu hình React Hook Form với Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterType>({
    resolver: zodResolver(RegisterValidationSchema),
  });

  // ✅ Xử lý submit form
  const onSubmit = async (data: RegisterType) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        "https://top-gear-be.vercel.app/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            usersname: data.username,
            fullname: data.fullname,
            phone: data.phone,
            address: data.address,
            sex: data.sex === "male" ? "nam" : "nữ",
          }),
        }
      );

      // Kiểm tra kiểu nội dung phản hồi
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Đăng ký thất bại");
        }

        toast({
          title: "Thành công",
          description: "Đăng ký tài khoản thành công!",
        });
        router.push("/login");
      } else {
        const textResponse = await response.text();
        // throw new Error("Server trả về định dạng không mong đợi");
      }      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: unknown) {
      // console.error("Lỗi chi tiết:", error);
      setErrorMessage(error instanceof Error ? error.message : "Đăng ký thất bại");
      toast({
        title: "Lỗi",
        description: "Đăng ký thất bại",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="2xl:w-1/3 max-w-xl mx-auto p-4 border rounded shadow-md bg-white"
      >
        <h2 className="text-xl font-bold mb-4">Đăng ký tài khoản</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-base font-semibold">Họ và Tên</label>
          <input
            type="text"
            {...register("fullname")}
            className="w-full p-2 border rounded bg-gray-100 focus:bg-white"
          />
          {errors.fullname && (
            <p className="text-red-500">{errors.fullname.message}</p>
          )}
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-base font-semibold">Tên đăng nhập</label>
          <input
            type="text"
            {...register("username")}
            className="w-full p-2 border rounded bg-gray-100 focus:bg-white"
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-base font-semibold">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full p-2 border rounded bg-gray-100 focus:bg-white"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-base font-semibold">Số điện thoại</label>
          <input
            type="text"
            {...register("phone")}
            className="w-full p-2 border rounded bg-gray-100 focus:bg-white"
          />
          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-base font-semibold">Địa chỉ</label>
          <input
            type="text"
            {...register("address")}
            className="w-full p-2 border rounded bg-gray-100 focus:bg-white"
          />
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}
        </div>

        {/* Sex */}
        <div className="mb-4">
          <label className="block text-base font-semibold">Giới tính</label>
          <select
            {...register("sex")}
            className="w-full p-2 border rounded bg-gray-100 focus:bg-white"
          >
            {Object.entries(SEX_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-base font-semibold">Mật khẩu</label>
          <input
            type="password"
            {...register("password")}
            className="w-full p-2 border rounded bg-gray-100 focus:bg-white"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-base font-semibold">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="w-full p-2 border rounded bg-gray-100 focus:bg-white"
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-blue-500 text-white"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </Button>
      </form>
    </div>
  );
}

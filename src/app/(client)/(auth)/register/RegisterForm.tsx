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
import { Loader } from "@/components/atoms/feedback/Loader";
import { Mail, Lock, User, UserCircle, ArrowRight, LogIn, CheckCircle2 } from "lucide-react";
import Link from "next/link";

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
        `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/auth/register`,
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
            // phone: data.phone,
            // address: data.address,
            // sex: data.sex === "male" ? "nam" : "nữ",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        {/* Logo/Header */}
        <div className="text-center mb-8 sm:mb-12">
          <Link href="/" className="inline-block mb-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl sm:text-2xl">E</span>
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">E-COM</span>
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Tạo tài khoản mới
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Đăng ký để bắt đầu mua sắm ngay hôm nay
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Họ và Tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register("fullname")}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                />
              </div>
              {errors.fullname && (
                <p className="text-red-500 text-xs mt-1">{errors.fullname.message}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register("username")}
                  placeholder="username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="example@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Giới tính
              </label>
              <select
                {...register("sex")}
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base bg-white"
              >
                {Object.entries(SEX_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size="sm" variant="white" />
                  Đang xử lý...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Đăng ký
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 sm:my-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">hoặc</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Đã có tài khoản?
            </p>
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-600 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Đăng nhập
                </span>
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Quay lại trang chủ
            </Link>
          </div>
        </div>

        {/* Terms */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Bằng cách đăng ký, bạn đồng ý với{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            Điều khoản sử dụng
          </Link>{" "}
          và{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            Chính sách bảo mật
          </Link>
        </p>
      </div>
    </div>
  );
}

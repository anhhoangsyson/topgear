"use client";
import {
  LoginValidationSchema,
  LoginType,
} from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import AuthButtons from "@/components/atoms/custom/AuthButton";
import { Button } from "@/components/atoms/ui/Button";
import { Loader } from "@/components/atoms/feedback/Loader";
import { Mail, Lock, LogIn, ArrowRight, UserPlus } from "lucide-react";
export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter(); // Create an instance of the router
  const searchParams = useSearchParams();

  // check if user is navigated form other page with message in url
  useEffect(() => {
    const message = searchParams?.get("message");
    if (message) {
      toast({
        title: "Thông báo",
        description: message,
        duration: 3000,
        variant: "default",
      });
    }
  }, [searchParams]);
  // ✅ config React Hook Form with Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(LoginValidationSchema),
  });

  // ✅ handle submit form
  const onSubmit = async (data: LoginType) => {
    setLoading(true);
    setErrorMessage("");

    try {
      // send req to server
      // const response = await fetch(
      //   "https://top-gear-be.vercel.app/api/v1/auth/login",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       email: data.email,
      //       password: data.password,
      //     }),
      //   }
      // );

      const res = await signIn("credentials", { ...data, redirect: false });

      if (res?.ok) {
        // ✅ Đợi session update (có thể mất vài ms)
        let session = await getSession();
        let retries = 0;
        const maxRetries = 5;
        
        // Retry nếu chưa có accessToken (session có thể chưa update)
        while (!session?.accessToken && retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 200)); // Đợi 200ms
          session = await getSession();
          retries++;
        }
        
        if (session?.accessToken) {
          // ✅ Lưu token vào cookie (giống Facebook login)
          try {
            const cookieRes = await fetch("/api/auth", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                accessToken: session.accessToken,
              }),
            });
            
            if (!cookieRes.ok) {
              if (process.env.NODE_ENV === 'development') {
                const errorText = await cookieRes.text();
                console.warn('[LoginForm] Failed to save token to cookie:', errorText);
              }
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('[LoginForm] Error saving token to cookie:', error);
            }
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.error('[LoginForm] No accessToken in session after login (tried', maxRetries, 'times)');
          }
        }

        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng thượng đế đến với hệ thống E-COM!",
        });

        // Redirect sau khi lưu cookie thành công
        const callbackUrl = searchParams?.get("callbackUrl") || "/";
        router.push(callbackUrl);
        router.refresh(); // Refresh để update session
      } else {
        // Login failed
        const error = res?.error || "Đăng nhập thất bại";
        setErrorMessage(error);
        toast({
          title: "Lỗi",
          description: error,
          variant: "destructive",
        });
      }
      // const contentType = response.headers.get("content-type");

      // if (contentType && contentType.includes("application/json")) {
      //   const result = await response.json();
      //   if (response.ok) {
      //     toast({
      //       title: "Đăng nhập thành công",
      //       description: "Chào mừng thượng đế đến với hệ thống E-COM!",
      //     });

      //     // save data user (ex: token) in localStorage
      //     // localStorage.setItem("authToken", result.data.token);
      //     // khong luu o localStorage vi co the bi xoa

      //     // save sessionToken in cookie
      //     // document.cookie = `accessToken=${result.data.token}; path=/; max-age=36000; secure; samesite=strict`;

      //     // luu ca token o trong next server
      //     const authRes = await fetch("/api/auth/", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({
      //         accessToken: result.data.token,
      //       }),
      //     });
      //     const authData = await authRes.json();

      //     // naviate /
      //     router.push("/");
      //   } else {
      //     throw new Error(result.message || "Đăng nhập thất bại");
      //   }
      // } else {
      //   const textResponse = await response.text();
      //   throw new Error("Server trả về định dạng không mong đợi");
      // }
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      setErrorMessage(errMessage);
      toast({
        title: "Lỗi",
        description: errMessage || "Đăng nhập thất bại",
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
            Chào mừng trở lại
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Đăng nhập để tiếp tục mua sắm
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

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
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

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu
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
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
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
                  <LogIn className="w-5 h-5" />
                  Đăng nhập
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

          {/* Social Login */}
          <div className="space-y-3">
            <AuthButtons />
            
            <Link href="/register" className="block">
              <Button
                variant="outline"
                className="w-full border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-600 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Tạo tài khoản mới
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
          Bằng cách đăng nhập, bạn đồng ý với{" "}
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

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
export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter(); // Create an instance of the router
  const searchParams = useSearchParams();

  // check if user is navigated form other page with message in url
  useEffect(() => {
    const message = searchParams.get("message");
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
          console.log(`[LoginForm] ⏳ Waiting for session to update... (attempt ${retries + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 200)); // Đợi 200ms
          session = await getSession();
          retries++;
        }
        
        if (session?.accessToken) {
          console.log('[LoginForm] ✅ Got accessToken from session, saving to cookie...');
          console.log('[LoginForm] 📝 Token length:', session.accessToken.length);
          
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
            
            if (cookieRes.ok) {
              console.log('[LoginForm] ✅ Token saved to cookie successfully');
            } else {
              const errorText = await cookieRes.text();
              console.warn('[LoginForm] ⚠️ Failed to save token to cookie:', errorText);
            }
          } catch (error) {
            console.error('[LoginForm] ❌ Error saving token to cookie:', error);
          }
        } else {
          console.error('[LoginForm] ❌ No accessToken in session after login (tried', maxRetries, 'times)');
          console.error('[LoginForm] Session data:', {
            hasSession: !!session,
            hasAccessToken: !!session?.accessToken,
            sessionKeys: session ? Object.keys(session) : [],
            userKeys: session?.user ? Object.keys(session.user) : []
          });
        }

        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng thượng đế đến với hệ thống E-COM!",
        });

        // Redirect sau khi lưu cookie thành công
        const callbackUrl = searchParams.get("callbackUrl") || "/account";
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


  const handleFacebookLogin = async () => {
    signIn("facebook", { callbackUrl: `/account` })
  }

  return (
    <div className="my-20 2xl:w-1/3 max-w-xl mx-auto rounded shadow-sm bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm  font-semibold">Email</label>
          <input
            type="email"
            {...register("email")}
            className="mt-2 p-2 w-full border rounded bg-white focus:bg-white focus:border-gray-700 outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-[13px]">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Mật khẩu</label>
          <input
            type="password"
            {...register("password")}
            className="mt-2 p-2 w-full border rounded bg-white focus:bg-white focus:border-gray-700 outline-none"
          />
          {errors.password && (
            <p className="text-red-500 text-[13px]">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="block mx-auto 2xl:w-[290px] w-full p-2 bg-blue-500 text-white text-[13px] font-medium rounded"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>

        <div className="text-center mx-auto mt-4 text-sm font-light text-[#2D88FF]">
          Or
        </div>
      </form>

      <div className="p-4 pb-16 mx-auto">
        <div className="flex flex-col gap-y-4 2xl:w-[290px] mx-auto">
          <AuthButtons />
          <Link
            className="w-full"
            href="/register">
            <Button
              variant="default"
              className="w-full bg-[#1877F2] text-white"
            >
              Register
            </Button>
          </Link>
        </div>
        <div>
        </div>
      </div>
    </div>
  );
}

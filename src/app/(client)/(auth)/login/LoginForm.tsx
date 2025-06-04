"use client";
import {
  LoginValidationSchema,
  LoginType,
} from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthButtons from "@/components/auth/AuthButton";
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

      const res = await signIn("credentials", { ...data });

      if (res?.ok) {
        console.log("res", res);

        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng thượng đế đến với hệ thống Top Gear!",
        });

        // await fetch(`${process.env.NEXTAUTH_UR}/api/auth`, {
        //   method: "POST",
        //   body: JSON.stringify({ accessToken: data.accessToken }),
        // })

        // router.push("/account");

      }
      // const contentType = response.headers.get("content-type");

      // if (contentType && contentType.includes("application/json")) {
      //   const result = await response.json();
      //   if (response.ok) {
      //     toast({
      //       title: "Đăng nhập thành công",
      //       description: "Chào mừng thượng đế đến với hệ thống Top Gear!",
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
      //     console.log("authData", authData);

      //     // naviate /
      //     router.push("/");
      //   } else {
      //     throw new Error(result.message || "Đăng nhập thất bại");
      //   }
      // } else {
      //   const textResponse = await response.text();
      //   console.error("Phản hồi không phải JSON:", textResponse);
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

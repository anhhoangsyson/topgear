"use client";
import { LoginValidationSchema, LoginType, SEXENUM, SEX_LABELS } from "@/schemaValidations/auth.schema";
import { RegisterValidationSchema, RegisterType } from "@/schemaValidations/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "@/hooks/use-toast"
import {Button} from "@/components/ui/Button";

export default function RegisterForm() {
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
            console.log('data', data);


            toast({
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            })
            console.log('toast', toast);


        } catch (error: any) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
        console.log('errors', errors);

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
            {errors.fullname && <p className="text-red-500">{errors.fullname.message}</p>}
          </div>
  
          {/* Username */}
          <div className="mb-4">
            <label className="block text-base font-semibold">Tên đăng nhập</label>
            <input type="text" {...register("username")} className="w-full p-2 border rounded bg-gray-100 focus:bg-white" />
            {errors.username && <p className="text-red-500">{errors.username.message}</p>}
          </div>
  
          {/* Email */}
          <div className="mb-4">
            <label className="block text-base font-semibold">Email</label>
            <input type="email" {...register("email")} className="w-full p-2 border rounded bg-gray-100 focus:bg-white" />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
  
          {/* Phone */}
          <div className="mb-4">
            <label className="block text-base font-semibold">Số điện thoại</label>
            <input type="text" {...register("phone")} className="w-full p-2 border rounded bg-gray-100 focus:bg-white" />
            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
          </div>
  
          {/* Address */}
          <div className="mb-4">
            <label className="block text-base font-semibold">Địa chỉ</label>
            <input type="text" {...register("address")} className="w-full p-2 border rounded bg-gray-100 focus:bg-white" />
            {errors.address && <p className="text-red-500">{errors.address.message}</p>}
          </div>
  
          {/* Sex */}
          <div className="mb-4">
            <label className="block text-base font-semibold">Giới tính</label>
            <select {...register("sex")} className="w-full p-2 border rounded bg-gray-100 focus:bg-white">
              {Object.entries(SEX_LABELS).map(([key,label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
  
          {/* Password */}
          <div className="mb-4">
            <label className="block text-base font-semibold">Mật khẩu</label>
            <input type="password" {...register("password")} className="w-full p-2 border rounded bg-gray-100 focus:bg-white" />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
  
          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-base font-semibold">Xác nhận mật khẩu</label>
            <input type="password" {...register("confirmPassword")} className="w-full p-2 border rounded bg-gray-100 focus:bg-white" />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
          </div>
  
          {/* Submit Button */}
          <Button type="submit" className="w-full bg-blue-500 text-white" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </form>
      </div>
    );
}


"use client";
import { LoginValidationSchema, LoginType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { toast, useToast } from "@/hooks/use-toast"
import {Button} from "@/components/ui/Button";
import Link from "next/link";

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // ✅ Cấu hình React Hook Form với Zod Resolver
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginType>({
        resolver: zodResolver(LoginValidationSchema),
    });

    // ✅ Xử lý submit form
    const onSubmit = async (data: LoginType) => {
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
    };

    return (
        <div className="my-20 2xl:w-1/3 max-w-xl mx-auto rounded shadow-sm bg-white">
            <form onSubmit={handleSubmit(onSubmit)} className=" p-4  ">
                <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                {/* Email */}
                <div className="mb-4">
                    <label className="block text-base font-semibold">Email</label>
                    <input
                        type="email"
                        {...register("email")}
                        className="mt-2 p-2 w-full border rounded bg-[#f6f6f9] focus:bg-white focus:border-gray-700 outline-none"
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>
                {/* Password */}
                <div className="mb-4">
                    <label className="block text-base font-semibold">Mật khẩu</label>
                    <input
                        type="password"
                        {...register("password")}
                        className="mt-2 p-2 w-full border rounded bg-[#f6f6f9] focus:bg-white focus:border-gray-700 outline-none"
                    />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>
                {/* Submit Button */}
                <button
                    type="submit"
                    className="block mx-auto 2xl:w-[290px] w-full p-2 bg-blue-500 text-white text-sm font-medium rounded"
                    disabled={loading}
                >
                    {loading ? "Đang xử lý..." : "Đăng nhập"}
                </button>

                {/* css spacing */}
                <div className="text-center mx-auto mt-4 text-sm font-light text-[#2D88FF]">Or</div>

            </form>
            {/* login with gg and fb */}

            <div className="p-4 pb-16 mx-auto ">
                <div className="flex flex-col gap-y-4 2xl:w-[290px] mx-auto">
                    <Button
                        variant="default"

                        className="w-full bg-[#1877F2] text-white"
                    >
                        Login with Facebook
                    </Button>

                    <Button
                        variant="destructive"
                        className="w-full text-white"
                    >
                        Login with Google
                    </Button>

                    <Link

                        href="/register">
                        <Button
                            variant="default"
                            className="w-full bg-[#1877F2] text-white"
                        >
                            Register
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

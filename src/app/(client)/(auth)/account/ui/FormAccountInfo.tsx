"use client";
import {  SEX_LABELS } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { IUser, UserType, UserValidationSchema } from "@/schemaValidations/user.schema";

export default function FormAccountInfo({ userInfo }: { userInfo: IUser }) {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isFormChanged, setIsFormChanged] = useState(false);

    // default value
    const defaultValues: UserType = {
        id: userInfo.id,
        fullname: userInfo.fullname,
        username: userInfo.username,
        email: userInfo.email,
        phone: "0"+(userInfo.phone),
        address: userInfo.address,
        sex: 'female',
        avatar: userInfo.avatar ,
        birdth: userInfo.birdth,
        role: "user",
    };


    // ✅ Config React Hook Form with Zod Resolver
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<UserType>({
        resolver: zodResolver(UserValidationSchema),
        // defaultValues,
    });

    // Follow change of value filed in form
    const watchedValues = watch();

    useEffect(() => {
        const isChanged = Object.keys(watchedValues).some(
            key => watchedValues[key as keyof IUser] !== defaultValues[key as keyof IUser]
        )
        setIsFormChanged(isChanged);
    }, [watchedValues])

    // ✅ Handle submit form
    const onSubmit = async (data: UserType) => {
        setLoading(true);

        setErrorMessage("");

        try {
            console.log('cc');
            
            console.log('data', data);

            // toast({
            //     title: "Uh oh! Something went wrong.",
            //     description: "There was a problem with your request.",
            // })
            // console.log('toast', toast);


        } catch (error) {
            setErrorMessage(error as string);
        } finally {
            setLoading(false);
        }

    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full mx-auto p-4 rounded bg-white"
        >
            <h2 className="text-xl font-bold mb-4">Thông tin tài khoản</h2>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            {/* Full Name */}
            <div className="mb-4">
                <label className="block mb-2 text-[14px] font-semibold">Họ tên</label>
                <input
                    type="text"
                    {...register("fullname")}
                    className="w-full p-2 rounded bg-[#F6F6F6] text-[14px] focus:outline-blue-500"
                />
                {errors.fullname && <p className="text-red-500">{errors.fullname.message}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
                <label className="block mb-2 text-[14px] font-semibold">Email</label>
                <input type="email" {...register("email")} className="w-full p-2 rounded bg-[#F6F6F6] text-[14px] focus:outline-blue-500" />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="mb-4">
                <label className="block mb-2 text-[14px] font-semibold">Số điện thoại</label>
                <input type="text" {...register("phone")} className="w-full p-2 rounded bg-[#F6F6F6] text-[14px] focus:outline-blue-500"
                    disabled />
                {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
            </div>

            {/* Birdth */}
            <div className="mb-4">
                <label className="block mb-2 text-[14px] font-semibold">Ngày sinh</label>
                <input type="date" {...register("birdth")}
                    className="w-full p-2 rounded bg-[#F6F6F6] text-[14px] focus:outline-blue-500"
                    disabled />
                {errors.address && <p className="text-red-500">{errors.address.message}</p>}
            </div>

            {/* Sex */}
            <div className="mb-4">
                <label className="block mb-2 text-[14px] font-semibold">Giới tính</label>
                <select {...register("sex")} className="w-full p-2 rounded bg-[#F6F6F6] text-[14px] focus:outline-blue-500">
                    {Object.entries(SEX_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>
            {/* Submit Button */}
            <Button
                type="submit"
                className={`w-24 text-white ${isFormChanged ? 'bg-blue-500 cursor-pointer hover:bg-blue-500' : 'bg-[#d2d2d2]'}`}
                disabled={loading || !isFormChanged}>
                {loading ? "Đang xử lý..." : "Cập nhật"}
            </Button>
        </form >
    );
}


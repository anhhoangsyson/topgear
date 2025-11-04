"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { Button } from "@/components/atoms/ui/Button";

// Schema FE khớp BE (dựa trên users.dto.ts)
const UserInfoSchema = z.object({
    fullname: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    usersname: z.string().min(2, "Tên đăng nhập tối thiểu 2 ký tự"),
    phone: z.string().optional(),
    address: z.string().optional(),
    sex: z.enum(["male", "female", "other"]),
    avatar: z.string().optional(),
});

type UserInfoForm = z.infer<typeof UserInfoSchema>;

// Interface for userInfo prop based on actual API response structure
interface UserInfoData {
    fullname?: string;
    email?: string;
    usersname?: string;
    phone?: string | number;
    address?: string;
    sex?: "male" | "female" | "other";
    avatar?: string;
}

const SEX_LABELS = {
    male: "Nam",
    female: "Nữ",
    other: "Khác",
};

export default function FormAccountInfo({ userInfo }: { userInfo: UserInfoData }) {
    // const { data: session, update } = useSession();
    const {data: session} = useSession();
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Chuẩn hóa dữ liệu đầu vào cho form
    const defaultValues: UserInfoForm = {
        fullname: userInfo?.fullname || "",
        email: userInfo?.email || "",
        usersname: userInfo?.usersname || "",
        phone: userInfo?.phone ? String(userInfo.phone) : "",
        address: userInfo?.address || "",
        sex: (userInfo?.sex as "male" | "female" | "other") || "male",
        avatar: userInfo?.avatar || "",
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
    } = useForm<UserInfoForm>({
        resolver: zodResolver(UserInfoSchema),
        defaultValues,
    });

    useEffect(() => {
        reset(defaultValues);
    }, [userInfo]);

    const onSubmit = async (data: UserInfoForm) => {
        setLoading(true);
        setSuccessMsg("");
        setErrorMsg("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/users/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken || ""}`,
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Cập nhật thất bại");
            }
            setSuccessMsg("Cập nhật thành công!");
            // await update();
            reset(data);        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6 pb-4 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Thông tin tài khoản</h2>
                <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin cá nhân của bạn</p>
            </div>

            {successMsg && (
                <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                    {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Họ tên */}
                    <div className="md:col-span-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Họ tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("fullname")}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Nhập họ tên"
                        />
                        {errors.fullname && (
                            <p className="mt-1 text-sm text-red-500">{errors.fullname.message}</p>
                        )}
                    </div>

                    {/* Email (readonly) */}
                    <div className="md:col-span-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Email
                        </label>
                        <input
                            {...register("email")}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                            disabled
                        />
                        <p className="mt-1 text-xs text-gray-400">Email không thể thay đổi</p>
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Tên đăng nhập <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("usersname")}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Nhập tên đăng nhập"
                        />
                        {errors.usersname && (
                            <p className="mt-1 text-sm text-red-500">{errors.usersname.message}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Số điện thoại
                        </label>
                        <input
                            {...register("phone")}
                            type="tel"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Nhập số điện thoại"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Sex */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Giới tính <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register("sex")}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        >
                            {Object.entries(SEX_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                        {errors.sex && (
                            <p className="mt-1 text-sm text-red-500">{errors.sex.message}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Địa chỉ
                        </label>
                        <input
                            {...register("address")}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Nhập địa chỉ"
                        />
                        {errors.address && (
                            <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => reset()}
                        disabled={loading || !isDirty}
                        className="px-6"
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading || !isDirty}
                        className={`px-8 ${isDirty ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                Đang lưu...
                            </span>
                        ) : (
                            "Cập nhật thông tin"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import * as z from "zod";
import { useSession } from "next-auth/react";

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

const SEX_LABELS = {
    male: "Nam",
    female: "Nữ",
    other: "Khác",
};

export default function FormAccountInfo({ userInfo }: { userInfo: any }) {
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
            reset(data);
        } catch (err: any) {
            setErrorMsg(err.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-lg mx-auto p-6 rounded-lg bg-white shadow"
        >
            <h2 className="text-xl font-bold mb-4">Thông tin tài khoản</h2>
            {successMsg && <div className="mb-2 text-green-600">{successMsg}</div>}
            {errorMsg && <div className="mb-2 text-red-500">{errorMsg}</div>}

            {/* Họ tên */}
            <div className="mb-4">
                <label className="block mb-1 font-semibold">Họ tên</label>
                <input
                    {...register("fullname")}
                    className="w-full p-2 rounded bg-gray-100 focus:outline-blue-500"
                />
                {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname.message}</p>}
            </div>

            {/* Email (readonly) */}
            <div className="mb-4">
                <label className="block mb-1 font-semibold">Email</label>
                <input
                    {...register("email")}
                    className="w-full p-2 rounded bg-gray-100 focus:outline-blue-500"
                    disabled
                />
            </div>

            {/* Username */}
            <div className="mb-4">
                <label className="block mb-1 font-semibold">Tên đăng nhập</label>
                <input
                    {...register("usersname")}
                    className="w-full p-2 rounded bg-gray-100 focus:outline-blue-500"
                />
                {errors.usersname && <p className="text-red-500 text-sm">{errors.usersname.message}</p>}
            </div>

            {/* Phone */}
            <div className="mb-4">
                <label className="block mb-1 font-semibold">Số điện thoại</label>
                <input
                    {...register("phone")}
                    className="w-full p-2 rounded bg-gray-100 focus:outline-blue-500"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            {/* Address */}
            <div className="mb-4">
                <label className="block mb-1 font-semibold">Địa chỉ</label>
                <input
                    {...register("address")}
                    className="w-full p-2 rounded bg-gray-100 focus:outline-blue-500"
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>

            {/* Sex */}
            <div className="mb-4">
                <label className="block mb-1 font-semibold">Giới tính</label>
                <select
                    {...register("sex")}
                    className="w-full p-2 rounded bg-gray-100 focus:outline-blue-500"
                >
                    {Object.entries(SEX_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
                {errors.sex && <p className="text-red-500 text-sm">{errors.sex.message}</p>}
            </div>

            {/* Avatar (ẩn hoặc cho phép upload nếu muốn) */}
            {/* <div className="mb-4">
        <label className="block mb-1 font-semibold">Avatar</label>
        <input
          {...register("avatar")}
          className="w-full p-2 rounded bg-gray-100 focus:outline-blue-500"
        />
      </div> */}

            <Button
                type="submit"
                className={`w-32 text-white ${isDirty ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300"}`}
                disabled={loading || !isDirty}
            >
                {loading ? "Đang lưu..." : "Cập nhật"}
            </Button>
        </form>
    );
}
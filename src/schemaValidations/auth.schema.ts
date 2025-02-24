import z from 'zod'

export const SEXENUM = z.enum(["male", "female", "other"]);
export const ROLEENUM = z.enum(["admin", "user", "guest"]);

export const SEX_LABELS: Record<z.infer<typeof SEXENUM>, string> = {
    male: "Nam",
    female: "Nữ",
    other: "Khác",
  };


export const LoginValidationSchema = z.object({
    email: z
        .string()
        .email({ 'message': 'Email không hợp lệ' }),
    password: z.string().min(6, { message: 'Mật khẩu phải lớn hơn 6 ký tự' }),
})

export const RegisterValidationSchema = z.object({
    fullname: z.string().min(9,{message: 'Họ tên phải lớn hơn 9 ký tự'}),

    username: z.string().min(6, { message: 'Tên đăng nhập phải lớn hơn 6 ký tự' }),

    email: z
        .string()
        .email({ 'message': 'Email không hợp lệ' }),

    phone: z.string().min(10).regex(/^(0[3|5|7|8|9])+([0-9]{8})\b$/, { message: "Số điện thoại không hợp lệ." }),

    address: z.string().min(10, { message: 'Địa chỉ phải lớn hơn 10 ký tự' }),

    sex: SEXENUM,

    password: z
        .string()
        .min(6, { message: 'Mật khẩu phải lớn hơn 6 ký tự' })
        .max(18, { message: "Mật khẩu không được vượt quá 18 ký tự." }),

    confirmPassword: z
        .string()
        .min(6, { message: "Mật khẩu xác nhận không hợp lệ." }),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp.",
        path: ["confirmPassword"],
        // setError for confirm password field
    });

export type SexType = z.infer<typeof SEXENUM>;
export type RoleType = z.infer<typeof ROLEENUM>;

export type LoginType = z.infer<typeof LoginValidationSchema>;
export type RegisterType = z.infer<typeof RegisterValidationSchema>;
import z from 'zod'

import { ROLEENUM, SEXENUM } from "@/schemaValidations/auth.schema";
import exp from 'constants';

export const UserValidationSchema = z.object({
    id: z.string(),
    fullname: z.string().min(9, { message: 'Họ tên phải lớn hơn 9 ký tự' }),
    username: z.string().min(6, { message: 'Tên đăng nhập phải lớn hơn 6 ký tự' }),
    email: z.string().email({ message: 'Email không hợp lệ' }),
    phone: z.string().min(10).regex(/^(0[3|5|7|8|9])+([0-9]{8})\b$/, { message: "Số điện thoại không hợp lệ." }),
    address: z.string().min(10, { message: 'Địa chỉ phải lớn hơn 10 ký tự' }).optional(),
    sex: SEXENUM,
    avatar: z.string().optional(),
    birdth: z.string().optional(),
    role: ROLEENUM,
});


export interface IUser {
    id: string;
    role: typeof ROLEENUM[keyof typeof ROLEENUM];
    fullname: string;
    username: string;
    email: string;
    phone: string;
    address?: string;
    sex: typeof SEXENUM[keyof typeof SEXENUM];
    avatar?: string,
    birdth?: string,
}


export type UserType = z.infer<typeof UserValidationSchema>;
import { cn } from "@/lib/utils";

import { ButtonHTMLAttributes } from "react";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'danger'| 'outline',
    size?: 'sm' | 'md' | 'lg',
}

const Button = ({ variant = 'default', size = 'sm', children, className, ...props }: ButtonProps) => {
    const baseStyle = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variantStyle = {
        default: 'bg-blue-500 text-white focus:ring-blue-500',
        outline: 'border border-blue-500 text-blue focus:ring-gray-500',
        danger: 'bg-red-500 text-white focus:ring-red-500',
    }

    const sizeStyle = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-2 text-base',
        lg: 'px-6 py-3 min-w-50 text-lg',
    }
    return (
        <button
            className={cn(baseStyle, variantStyle[variant], sizeStyle[size], className)}
            {...props}
        >
            {children}
        </button>
    )

}
export default Button;
// components/AuthButtons.tsx
import { Button } from "@/components/atoms/ui/Button";
import { signIn } from "next-auth/react";
import { FaFacebook } from "react-icons/fa";

export default function AuthButtons() {
  return (
    <Button
      type="button"
      onClick={() => signIn('facebook', { callbackUrl: '/' })}
      variant="outline"
      className="w-full flex items-center justify-center gap-3 py-3 sm:py-4 border-2 border-blue-600 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-lg font-semibold text-sm sm:text-base transition-all"
    >
      <FaFacebook className="text-xl w-5 h-5" />
      Đăng nhập với Facebook
    </Button>
  );
}
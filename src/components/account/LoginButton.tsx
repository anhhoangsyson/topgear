import { UserIcon } from '@/app/admin/icons'
import Link from 'next/link'
import React from 'react'

export default function LoginButton() {
  return (
     <Link
              href={"/login"}
              className="flex items-center border border-white rounded"
            >
              <div className="flex items-center gap-2 py-2 px-3 text-sm hover:bg-white hover:text-[#0E1746] transition-all duration-300 rounded">
                <UserIcon />
                Đăng nhập
              </div>
            </Link>
  )
}

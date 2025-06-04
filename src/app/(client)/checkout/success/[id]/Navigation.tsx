'use client'
import { Button } from '@/components/ui/Button'
import React from 'react'

export default function Navigation() {
  return (
    <div className='flex gap-x-4 items-center justify-center'>
                    <Button
                        onClick={() => window.location.href = "/"}
                        variant="outline"
                        className='px-24 bg-[#0e1746] text-white hover:bg-white hover:text-[#0e1746] hover:border-[#0e1746]'
                    >Tiếp tục mua hàng
                    </Button>

                    <Button
                        onClick={() => window.location.href = "/account/orders"}
                        className='px-24'
                        variant={"outline"}
                    >Đơn hàng của tôi
                    </Button>
                </div>
  )
}

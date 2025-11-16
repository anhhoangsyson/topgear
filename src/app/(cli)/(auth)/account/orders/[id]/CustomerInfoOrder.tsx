import { customerInfoRes } from '@/types'
import React from 'react'
import { User, Phone, MapPin, FileText } from 'lucide-react'

export default function CustomerInfoOrder({ customerInfo, note }: { customerInfo: customerInfoRes, note: string }) {
  
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-600" />
        Thông tin người nhận
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 mb-1">Họ và tên</p>
            <p className="text-sm sm:text-base font-medium text-gray-900">{customerInfo.fullname}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
            <p className="text-sm sm:text-base font-medium text-gray-900">{customerInfo.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">Địa chỉ giao hàng</p>
            <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{customerInfo.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">Ghi chú</p>
            <p className="text-sm sm:text-base text-gray-900 break-words">
              {note ? note : <span className="text-gray-400 italic">Không có ghi chú</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

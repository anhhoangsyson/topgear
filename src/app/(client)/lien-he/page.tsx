'use client'
import { Button } from "@/components/atoms/ui/Button";
import Wraper from "@/components/core/Wraper";
import React, { useState, useEffect } from "react";
import { Mail, MapPin, Phone, Clock, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { LocationRes } from "@/types";
import addressData from "@/../public/data/address.json";

// Helper function to get address name from ID
function getAddressName(type: "province" | "district" | "commune", id: string) {
  const provinceMap = Object.fromEntries(addressData.province.map((item: any) => [item.idProvince, item.name]));
  const districtMap = Object.fromEntries(addressData.district.map((item: any) => [item.idDistrict, item.name]));
  const communeMap = Object.fromEntries(addressData.commune.map((item: any) => [item.idCommune, item.name]));
  
  if (type === "province") return provinceMap[id] || "Không xác định";
  if (type === "district") return districtMap[id] || "Không xác định";
  if (type === "commune") return communeMap[id] || "Không xác định";
  return "Không xác định";
}

export default function LienHePage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState<string>("123 Đường ABC, Quận XYZ, TP.HCM");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        description: "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.",
        duration: 3000,
      });
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Fetch default address if user is logged in
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      // Check if user is logged in (session exists)
      if (!session?.user) {
        console.log('[Contact] User not logged in, using default address');
        return;
      }

      try {
        console.log('[Contact] Fetching default address...');
        
        const res = await fetch('/api/user/location', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        console.log('[Contact] Location API response status:', res.status);

        if (res.ok) {
          const data = await res.json();
          console.log('[Contact] Location data:', data);
          
          const locations: LocationRes[] = data.data || [];
          console.log('[Contact] Found locations:', locations.length);
          
          if (locations.length === 0) {
            console.log('[Contact] No locations found, keeping default address');
            return;
          }
          
          const defaultLocation = locations.find((loc: LocationRes) => loc.isDefault);
          
          if (defaultLocation) {
            console.log('[Contact] Found default location:', defaultLocation);
            const provinceName = getAddressName("province", defaultLocation.province);
            const districtName = getAddressName("district", defaultLocation.district);
            const wardName = getAddressName("commune", defaultLocation.ward);
            const fullAddress = `${defaultLocation.street}, ${wardName}, ${districtName}, ${provinceName}`;
            console.log('[Contact] Setting address to:', fullAddress);
            setDefaultAddress(fullAddress);
          } else {
            // If no default address, use first address
            console.log('[Contact] No default location found, using first location');
            const firstLocation = locations[0];
            const provinceName = getAddressName("province", firstLocation.province);
            const districtName = getAddressName("district", firstLocation.district);
            const wardName = getAddressName("commune", firstLocation.ward);
            const fullAddress = `${firstLocation.street}, ${wardName}, ${districtName}, ${provinceName}`;
            console.log('[Contact] Setting address to first location:', fullAddress);
            setDefaultAddress(fullAddress);
          }
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.error('[Contact] Failed to fetch locations:', res.status, res.statusText, errorData);
        }
      } catch (error) {
        console.error('[Contact] Error fetching default address:', error);
      }
    };

    fetchDefaultAddress();
  }, [session]);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      description: "Liên hệ với chúng tôi qua email",
      value: "ecomcontact@gmail.com",
      link: "mailto:ecomcontact@gmail.com",
      color: "text-blue-600"
    },
    {
      icon: Phone,
      title: "Số điện thoại",
      description: "Làm việc từ thứ 2 đến thứ 7 hàng tuần",
      value: "0123456789",
      link: "tel:0123456789",
      color: "text-green-600"
    },
    {
      icon: MapPin,
      title: "Địa chỉ",
      description: session?.user ? "Địa chỉ mặc định của bạn" : "Văn phòng của chúng tôi",
      value: defaultAddress,
      link: "#",
      color: "text-red-600"
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      description: "Thời gian hỗ trợ khách hàng",
      value: "Thứ 2 - Thứ 7: 8:00 - 17:00",
      link: "#",
      color: "text-purple-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 lg:py-16">
      <Wraper>
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các phương thức dưới đây.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <a
                  key={index}
                  href={info.link}
                  className="block group"
                  onClick={(e) => {
                    if (info.link === '#') e.preventDefault();
                  }}
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 p-3 rounded-xl bg-gray-50 group-hover:bg-blue-50 transition-colors ${info.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {info.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {info.description}
                        </p>
                        <p className={`text-sm sm:text-base font-medium ${info.color} break-words`}>
                          {info.value}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}

            {/* Chat Support Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-xl bg-white/20">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">
                    Chat trực tuyến
                  </h3>
                  <p className="text-sm text-blue-100 mb-3">
                    Chúng tôi hỗ trợ trực tuyến 24/7
                  </p>
                  <Button
                    variant="secondary"
                    className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                    onClick={() => {
                      toast({
                        description: "Tính năng chat trực tuyến sẽ sớm được triển khai!",
                        duration: 2000,
                      });
                    }}
                  >
                    Bắt đầu chat
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Send className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Gửi tin nhắn cho chúng tôi
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label 
                    htmlFor="firstName" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Họ của bạn <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                    placeholder="Nguyễn"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="lastName" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tên của bạn <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                    placeholder="Văn A"
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Địa chỉ email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                  placeholder="example@gmail.com"
                />
              </div>

              <div>
                <label 
                  htmlFor="message" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nội dung tin nhắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none resize-none"
                  placeholder="Nhập nội dung tin nhắn của bạn..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2 inline" />
                    Gửi tin nhắn
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </Wraper>
    </div>
  );
}

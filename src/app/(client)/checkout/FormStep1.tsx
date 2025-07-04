'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { IUser } from '../../../schemaValidations/user.schema';
import { useSession } from 'next-auth/react';
import useCartStore from '@/store/cartStore';
import { Button } from '@/components/atoms/ui/Button';
import { Dialog, DialogContent } from '@radix-ui/react-dialog';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/atoms/ui/dialog';

// Định nghĩa các interface
interface IProvince {
  idProvince: string;
  name: string;
}

interface IDistrict {
  idProvince: string;
  idDistrict: string;
  name: string;
}

interface ICommune {
  idDistrict: string;
  idCommune: string;
  name: string;
}

interface IAddressData {
  province: IProvince[];
  district: IDistrict[];
  commune: ICommune[];
}

interface ILocation {
  _id: string;
  userId: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

const formSchema = z.object({
  fullName: z.string().min(1, { message: 'Tên không được để trống' }),
  phone: z.string().min(1, { message: 'Số điện thoại không được để trống' }),
  email: z.string().email({ message: 'Email không hợp lệ' }).optional(),
  shippingAddress: z.object({
    province: z.string().min(1, { message: 'Tỉnh/thành phố không được để trống' }),
    district: z.string().min(1, { message: 'Quận/huyện không được để trống' }),
    ward: z.string().min(1, { message: 'Phường/xã không được để trống' }),
    street: z.string().min(1, { message: 'Đường/phố không được để trống' }),
  }),
  note: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const addressSchema = z.object({
  province: z.string().min(1, { message: 'Tỉnh/thành phố không được để trống' }),
  district: z.string().min(1, { message: 'Quận/huyện không được để trống' }),
  ward: z.string().min(1, { message: 'Phường/xã không được để trống' }),
  street: z.string().min(1, { message: 'Đường/phố không được để trống' }),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function Step1({ selectedItems, onSubmitStep1, initialCustomerInfo }:
  {
    selectedItems: {
      _id: string;
      name: string;
      price: number;
      discountPrice: number;
      quantity: number;
      image: string;
    }[],
    onSubmitStep1: (data: FormData) => void,
    initialCustomerInfo?: {
      name: string;
      email: string;
      phone: string;
      address: string;
      note: string;
    };
  }) {
  const session = useSession()

  const [customerInfo, setCustomerInfo] = useState<Omit<IUser, '_id' | 'role' | 'password'>>({} as any);
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addressData, setAddressData] = useState<IAddressData>({
    province: [],
    district: [],
    commune: [],
  });

  const [showAddAddressModal, setShowAddAddressModal] = useState<boolean>(false);

  const totalPrice = selectedItems.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);
  let discount = 0;
  const selectedVoucher = useCartStore((state) => state.selectedVoucher);
  if (selectedVoucher) {
    if (selectedVoucher.pricePercent > 0) {
      discount = Math.floor((totalPrice * selectedVoucher.pricePercent) / 100);
    } else if (selectedVoucher.priceOrigin > 0) {
      discount = Math.min(selectedVoucher.priceOrigin, totalPrice);
    }
  }
  const finalTotal = totalPrice - discount;
  const discountFormatted = discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  const finalTotalFormatted = finalTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialCustomerInfo?.name || '',
      phone: initialCustomerInfo?.phone || '',
      email: initialCustomerInfo?.email || '',
      shippingAddress: {
        province: initialCustomerInfo?.address.split(', ')[3] || '',
        district: initialCustomerInfo?.address.split(', ')[2] || '',
        ward: initialCustomerInfo?.address.split(', ')[1] || '',
        street: initialCustomerInfo?.address.split(', ')[0] || '',
      },
      note: initialCustomerInfo?.note || '',
    },
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      province: '',
      district: '',
      ward: '',
      street: '',
    },
  });

  const { register, handleSubmit, setValue, formState: { errors } } = form;
  const { register: registerAddress, handleSubmit: handleAddressSubmit, watch: watchAddress, setValue: setAddressValue, formState: { errors: addressErrors } } = addressForm;

  const selectedProvince = watchAddress('province');
  const selectedDistrict = watchAddress('district');
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [communes, setCommunes] = useState<ICommune[]>([]);

  useEffect(() => {
    const getCustomerInfo = async () => {
      const res = await fetch(`/api/user/get-access-token`, { method: 'GET' });
      const { accessToken } = await res.json();
      if (!accessToken) {
        return;
      }

      const [userRes, locationsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/auth/me`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        }),
        fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/location`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        }),
      ]);

      const userData = await userRes.json();
      const locationsData = await locationsRes.json();

      if (userRes.status === 200) {
        setCustomerInfo(userData.data);
        setValue('fullName', userData.data.fullname);
        setValue('phone', String(userData.data.phone));
        setValue('email', userData.data.email);
      } else {
        console.error('Lỗi lấy thông tin user:', userData);
      }

      if (locationsRes.status === 200) {
        setLocations(locationsData.data || []);
        const defaultLocation = locationsData.data.find((loc: ILocation) => loc.isDefault);
        if (defaultLocation) {
          const provinceName = addressData.province.find(p => p.idProvince === defaultLocation.province)?.name || '';
          const districtName = addressData.district.find(d => d.idDistrict === defaultLocation.district)?.name || '';
          const wardName = addressData.commune.find(c => c.idCommune === defaultLocation.ward)?.name || '';

          setValue('shippingAddress', {
            province: provinceName,
            district: districtName,
            ward: wardName,
            street: defaultLocation.street,
          });
        }
      } else {
        console.error('Lỗi lấy danh sách location:', locationsData);
      }

      setLoading(false);
    };
    getCustomerInfo();
  }, [setValue]);

  useEffect(() => {
    fetch('/data/address.json')
      .then((res) => res.json())
      .then((data: IAddressData) => setAddressData(data))
      .catch((err) => console.error('Lỗi tải dữ liệu:', err));
  }, []);

  useEffect(() => {
    if (selectedProvince) {

      const filteredDistricts = addressData.district.filter(
        (dist) => dist.idProvince === selectedProvince
      );
      setDistricts(filteredDistricts);

      setCommunes([]);
      setAddressValue('district', '');
      setAddressValue('ward', '');
    }
  }, [selectedProvince, addressData.district, setAddressValue]);

  useEffect(() => {
    if (selectedDistrict) {
      const filteredCommunes = addressData.commune.filter(
        (comm) => comm.idDistrict === selectedDistrict
      );

      setCommunes(filteredCommunes);
      setAddressValue('ward', '');
    }

  }, [selectedDistrict, addressData.commune, setAddressValue]);

  const handleAddNewAddress = async (data: AddressFormData) => {
    const accessToken = session?.data?.accessToken;

    const payload = {
      province: data.province, // idProvince
      district: data.district, // idDistrict
      ward: data.ward, // idCommune
      street: data.street,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/location`, { // Sửa endpoint
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const newLocation = await res.json();
      setLocations([...locations, newLocation.data]);

      // anh xa id -> name de pass vao formstep2
      const provinceName = addressData.province.find(p => p.idProvince === data.province)?.name || '';
      const districtName = addressData.district.find(d => d.idDistrict === data.district)?.name || '';
      const wardName = addressData.commune.find(c => c.idCommune === data.ward)?.name || '';

      setValue('shippingAddress', {
        province: provinceName,
        district: districtName,
        ward: wardName,
        street: data.street,      }); // Truyền dữ liệu vào form chính
    } else {
      // Handle error - could show toast notification instead
      const errorData = await res.json();
      // TODO: Show user-friendly error message
    }
    setShowAddAddressModal(false);
  };

  const onSubmit = (data: FormData) => {
    onSubmitStep1(data)
    // Chuyển sang bước tiếp theo với data.shippingAddress
  };
  // const handleFormSubmit = (data: FormData) => {
  //   onSubmit(data); // Call prop onSubmit instead of logging
  // };

  // const onError = (errors ) => {
  // };

  const skeletonCustomerInfo = (
    <div className='w-full p-4 bg-white rounded'>
      <div className='flex items-center justify-between gap-x-4 mb-4'>
        <div className='w-1/2 h-4 bg-gray-200 animate-pulse rounded'></div>
        <div className='w-1/4 h-3 bg-gray-200 animate-pulse rounded'></div>
      </div>
      <div className='w-12 h-3 bg-gray-200 animate-pulse rounded mb-1'></div>
      <div className='w-full h-8 bg-gray-200 animate-pulse rounded'></div>
    </div>
  );

  return (
    <div className='h-screen'>
      {/* Thông tin sản phẩm */}
      {selectedItems.map((item) => (
        <div key={item._id} className='grid grid-cols-5 p-4 rounded bg-white pb-4'>
          <div className='col-span-1 object-cover'>
            <Image className='rounded' alt={item.name} height={100} width={100} src={item.image} />
          </div>
          <div className='col-span-3'>
            <p className='p-2 text-gray-700 text-sm text-wrap'>{item.name}</p>
            <div className='flex px-2'>
              <p className='text-[15px] font-thin text-red-500'>
                {item.discountPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                {item.discountPrice !== item.price && (
                  <span className='text-gray-400 line-through ml-2'>
                    {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className='col-span-1 flex items-center justify-center'>
            <p className='text-sm font-thin text-center'>
              Số lượng: <span className='text-red-500 font-thin text-sm'>{item.quantity}</span>
            </p>
          </div>
        </div>
      ))}

      {/* Form thông tin giao hàng */}
      <h3 className='my-2 mt-8 uppercase'>Thông tin giao hàng</h3>
      {loading ? skeletonCustomerInfo : (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full p-4 bg-white rounded'>
          <div className='flex items-center justify-between gap-x-4 mb-4'>
            <p className='text-gray-700 text-sm font-thin'>{customerInfo.fullname}</p>
            <p className='text-gray-400 text-xs font-thin'>{(customerInfo.phone)}</p>
          </div>

          {/* Email */}
          <div className='my-4'>
            <label className='block text-xs font-thin text-gray-400' htmlFor='email'>EMAIL</label>
            <input
              {...register('email')}
              className='w-full p-1 border-b-2 border-b-gray-700 outline-none text-gray-800 text-sm font-thin focus-within:border-b-blue-500'
              id='email'
              type='text'
              defaultValue={customerInfo.email}
            />
            {errors.email && <p className='text-red-500 text-xs'>{errors.email.message}</p>}
            <p className='mt-2 text-[11px] font-thin text-gray-400'>
              (*) Hóa đơn VAT sẽ được gửi qua email này
            </p>
          </div>

          {/* Chọn địa chỉ giao hàng */}
          <div className='my-4'>
            <label className='block text-xs font-thin text-gray-400 uppercase'>Địa chỉ giao hàng</label>
            <select
              onChange={(e) => {
                const selected = locations.find(loc => loc._id === e.target.value);
                if (selected) {

                  const provinceName = addressData.province.find(p => p.idProvince === selected.province)?.name || '';
                  const districtName = addressData.district.find(d => d.idDistrict === selected.district)?.name || '';
                  const wardName = addressData.commune.find(c => c.idCommune === selected.ward)?.name || '';

                  setValue('shippingAddress', {
                    province: provinceName,
                    district: districtName,
                    ward: wardName,
                    street: selected.street,
                  });
                }
              }}
              className='w-full p-1 border-b-2 border-b-gray-700 outline-none text-gray-800 text-sm font-thin focus-within:border-b-blue-500'
            >
              <option value=''>Chọn địa chỉ có sẵn</option>
              {locations.map((loc) => {
                const provinceName = addressData.province.find(p => p.idProvince === loc.province)?.name || '';
                const districtName = addressData.district.find(d => d.idDistrict === loc.district)?.name || '';
                const wardName = addressData.commune.find(c => c.idCommune === loc.ward)?.name || '';
                return (
                  <option key={loc._id} value={loc._id}>
                    {`${loc.street}, ${wardName}, ${districtName}, ${provinceName}`}
                  </option>)
              })}
            </select>
            {errors.shippingAddress?.province && <p className='text-red-500 text-xs'>{errors.shippingAddress.province.message}</p>}
            <Button
              type='button'
              onClick={() => setShowAddAddressModal(true)}
              variant='outline'
              className='mt-2'
            >
              Thêm địa chỉ mới
            </Button>
          </div>

          {/* Ghi chú */}
          <div className='my-4'>
            <label className='block text-xs font-thin text-gray-400 uppercase'>Ghi chú</label>
            <input
              {...register('note')}
              className='w-full p-1 border-b-2 border-b-gray-700 outline-none text-gray-800 text-sm font-thin focus-within:border-b-blue-500'
              id='note'
              type='text'
            />
          </div>
        </form>
      )}

      {/* Modal thêm địa chỉ mới */}
      <Dialog open={showAddAddressModal} onOpenChange={setShowAddAddressModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm địa chỉ mới</DialogTitle>
            <DialogDescription>Nhập thông tin địa chỉ giao hàng mới.</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <label className='block text-xs font-thin text-gray-400 uppercase'>Tỉnh/Thành phố</label>
              <select
                {...registerAddress('province')}
                className='w-full p-1 border-b-2 border-b-gray-700 outline-none text-gray-800 text-sm font-thin focus-within:border-b-blue-500'
              >
                <option value=''>Chọn tỉnh/thành phố</option>
                {addressData.province.map((prov) => (
                  <option key={prov.idProvince} value={prov.idProvince}>
                    {prov.name}
                  </option>
                ))}
              </select>
              {addressErrors.province && <p className='text-red-500 text-xs'>{addressErrors.province.message}</p>}
            </div>

            <div>
              <label className='block text-xs font-thin text-gray-400 uppercase'>Quận/Huyện</label>
              <select
                {...registerAddress('district')}
                disabled={!selectedProvince}
                className='w-full p-1 border-b-2 border-b-gray-700 outline-none text-gray-800 text-sm font-thin focus-within:border-b-blue-500 disabled:opacity-50'
              >
                <option value=''>Chọn quận/huyện</option>
                {districts.map((dist) => (
                  <option key={dist.idDistrict} value={dist.idDistrict}>
                    {dist.name}
                  </option>
                ))}
              </select>
              {addressErrors.district && <p className='text-red-500 text-xs'>{addressErrors.district.message}</p>}
            </div>

            <div>
              <label className='block text-xs font-thin text-gray-400 uppercase'>Phường/Xã</label>
              <select
                {...registerAddress('ward')}
                disabled={!selectedDistrict}
                className='w-full p-1 border-b-2 border-b-gray-700 outline-none text-gray-800 text-sm font-thin focus-within:border-b-blue-500 disabled:opacity-50'
              >
                <option value=''>Chọn phường/xã</option>
                {communes.map((comm) => (
                  <option key={comm.idCommune} value={comm.idCommune}>
                    {comm.name}
                  </option>
                ))}
              </select>
              {addressErrors.ward && <p className='text-red-500 text-xs'>{addressErrors.ward.message}</p>}
            </div>

            <div>
              <label className='block text-xs font-thin text-gray-400 uppercase'>Đường/Phố</label>
              <input
                {...registerAddress('street')}
                className='w-full p-1 border-b-2 border-b-gray-700 outline-none text-gray-800 text-sm font-thin focus-within:border-b-blue-500'
                type='text'
              />
              {addressErrors.street && <p className='text-red-500 text-xs'>{addressErrors.street.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddressSubmit(handleAddNewAddress)}
              variant='destructive'
              className='bg-blue-500'
            >
              Lưu và chọn
            </Button>
            <Button
              onClick={() => setShowAddAddressModal(false)}
              variant='outline'
            >
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tổng tiền */}
      <div className='mx-auto p-3 fixed bottom-0 rounded-tl rounded-tr h-28 w-[600px] bg-white shadow-lg'>
        <div className='flex items-center justify-between mt-2'>
          <p className='text-sm font-semibold text-gray-900'>Tổng tiền tạm tính:</p>
          <p className='text-sm font-semibold text-red-500'>
            {finalTotalFormatted}
          </p>
        </div>
        <Button

          onClick={handleSubmit(onSubmitStep1)} // Thêm onError để debug
          variant={'destructive'}
          className='w-full mt-4 bg-red-500'
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
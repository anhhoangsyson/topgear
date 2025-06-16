'use client'
import React, { useEffect, useState } from 'react'
import { LocationRes } from '@/types';
import { toast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';

import addressData from "@/../public/data/address.json";

// import for add address
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LocationApi } from '../../../../../services/location-api';
import { Button } from '@/components/atoms/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/atoms/ui/dialog';

interface IProvince { idProvince: string; name: string; }
interface IDistrict { idProvince: string; idDistrict: string; name: string; }
interface ICommune { idDistrict: string; idCommune: string; name: string; }
interface IAddressData {
    province: IProvince[];
    district: IDistrict[];
    commune: ICommune[];
}
const addressSchema = z.object({
    province: z.string().min(1, { message: 'Tỉnh/thành phố không được để trống' }),
    district: z.string().min(1, { message: 'Quận/huyện không được để trống' }),
    ward: z.string().min(1, { message: 'Phường/xã không được để trống' }),
    street: z.string().min(1, { message: 'Đường/phố không được để trống' }),
});
type AddressFormData = z.infer<typeof addressSchema>;

// Tạo map từ id sang tên
const provinceMap = Object.fromEntries(addressData.province.map(item => [item.idProvince, item.name]));
const districtMap = Object.fromEntries(addressData.district.map(item => [item.idDistrict, item.name]));
const communeMap = Object.fromEntries(addressData.commune.map(item => [item.idCommune, item.name]));



function getAddressName(type: "province" | "district" | "commune", id: string) {
    if (type === "province") return provinceMap[id] || "Không xác định";
    if (type === "district") return districtMap[id] || "Không xác định";
    if (type === "commune") return communeMap[id] || "Không xác định";
    return "Không xác định";
}

export const fetchAccessToken = async (): Promise<string | null> => {
    try {
        const res = await fetch('/api/user/get-access-token', {
            method: 'GET',
        });

        if (!res.ok) {
            console.error('Lỗi khi lấy access token:', res.statusText);
            return null;
        }

        const data = await res.json();

        return data.accessToken || null;
    } catch (error) {
        console.error('Lỗi khi gọi API get-access-token:', error);
        return null;
    }
};

export default function ListAddressCard({ locationsData }: { locationsData: LocationRes[] }) {
    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [addressDataState, setAddressDataState] = useState<IAddressData>({
        province: addressData.province,
        district: addressData.district,
        commune: addressData.commune,
    });
    const [isLoading, setIsLoading] = useState(false)

    const [districts, setDistricts] = useState<IDistrict[]>([]);
    const [communes, setCommunes] = useState<ICommune[]>([]);

    const addressForm = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            province: '',
            district: '',
            ward: '',
            street: '',
        },
    });
    const { register: registerAddress, handleSubmit: handleAddressSubmit, watch: watchAddress, setValue: setAddressValue, formState: { errors: addressErrors } } = addressForm;

    const selectedProvince = watchAddress('province');
    const selectedDistrict = watchAddress('district');



    const handleAddNewAddress = async (data: AddressFormData) => {
        setIsLoading(true);
        try {
            const accessToken = await fetchAccessToken();
            if (!accessToken) {
                toast({
                    title: 'Lỗi',
                    description: 'Không thể lấy access token',
                    variant: 'destructive'
                });
                setIsLoading(false);
                return;
            }
            const payload = {
                province: data.province,
                district: data.district,
                ward: data.ward,
                street: data.street,
                isDefault: false,
            };
            
            // const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/location`, {
            //     method: 'POST',
            //     headers: {
            //         'Authorization': `Bearer ${accessToken}`,
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(payload),
            // });
                        
            // if (res.ok) {
            //     toast({
            //         title: 'Thêm địa chỉ thành công',
            //         variant: 'default',
            //         duration: 1000,
            //     });
            //     setShowAddAddressModal(false);
            //     window.location.reload();
            // } else {
            //     toast({
            //         title: 'Lỗi khi lưu địa chỉ',
            //         description: (await res.json()).message || '',
            //         variant: 'destructive'
            //     });
            // }

            // change to use new API 
            const newLocation = await LocationApi.addLocation(payload)
            toast({
                title: 'Thêm địa chỉ thành công',
                description: `Địa chỉ ${getAddressName("province", newLocation.province)}, ${getAddressName("district", newLocation.district)}, ${getAddressName("commune", newLocation.ward)}, ${newLocation.street} đã được thêm`,
                variant: 'default',
                duration: 1000,
            })
        } catch (err) {
            console.log('Error adding new address:', err);
            
            toast({
                title: 'Lỗi',
                description: `Có lỗi xảy ra, vui lòng thử lại sau ${err}`,
                variant: 'destructive'
            });
        }
        setIsLoading(false);
    };

    const handleSetAddressDefault = async (id: string) => {
        setIsLoading(true)

        try {
            const accessToken = await fetchAccessToken();
            if (!accessToken) {
                toast({
                    title: 'Lỗi',
                    description: 'Không thể lấy access token',
                    variant: 'destructive'
                })
                setIsLoading(false)
                return
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/location/set-default/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            })
            if (!res.ok) {
                toast({
                    title: 'Đặt địa chỉ mặc định thất bại',
                    description: 'Vui lòng thử lại sau',
                    variant: 'destructive'
                })
                setIsLoading(false)
                return
            }

            toast({
                title: 'Đặt địa chỉ mặc định thành công',
                description: 'Địa chỉ đã được đặt làm địa chỉ mặc định',
                variant: 'default',
                duration: 1000,
            })
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: 'Có lỗi xảy ra, vui lòng thử lại sau',
                variant: 'destructive'
            })
            setIsLoading(false)
            return
        }
        finally {
            setIsLoading(false)

        }
    }

    const handleDeleteAddress = async (id: string) => {
        setIsLoading(true)

        try {
            const accessToken = await fetchAccessToken();
            if (!accessToken) {
                toast({
                    title: 'Lỗi',
                    description: 'Không thể lấy access token',
                    variant: 'destructive'
                })
                setIsLoading(false)
                return
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/location/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            })
            if (!res.ok) {
                toast({
                    title: 'Xóa địa chỉ thất bại',
                    description: 'Vui lòng thử lại sau',
                    variant: 'destructive',
                    duration: 1000,
                })
                setIsLoading(false)
                return
            }
            toast({
                title: 'Xóa địa chỉ thành công',
                description: 'Địa chỉ đã được xóa',
                variant: 'default',
                duration: 1000,
            })
            window.location.reload()
        } catch (error) {

        }
        finally {
            setIsLoading(false)

        }
    }

    useEffect(() => {
        setAddressDataState({
            province: addressData.province,
            district: addressData.district,
            commune: addressData.commune,
        });
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            const filteredDistricts = addressDataState.district.filter(
                (dist) => dist.idProvince === selectedProvince
            );
            setDistricts(filteredDistricts);
            setCommunes([]);
            setAddressValue('district', '');
            setAddressValue('ward', '');
        }
    }, [selectedProvince, addressDataState.district, setAddressValue]);

    useEffect(() => {
        if (selectedDistrict) {
            const filteredCommunes = addressDataState.commune.filter(
                (comm) => comm.idDistrict === selectedDistrict
            );
            setCommunes(filteredCommunes);
            setAddressValue('ward', '');
        }
    }, [selectedDistrict, addressDataState.commune, setAddressValue]);


    return (
        <div className='mt-8'>
            {isLoading && (
                <div className='fixed inset-0 w-screen h-screen z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center'>
                    <LoaderCircle className='animate-spin' />
                </div>
            )}
            <div
                className='flex justify-center items-center mt-4 w-full h-[68px] bg-white text-sm font-light border-dashed border-gray-400 border-2 rounded cursor-pointer'
                onClick={() => setShowAddAddressModal(true)}
            >
                Thêm địa chỉ mới
            </div>
            {locationsData?.map((location, index) => (
                <div
                    key={index}
                    className='flex items-center justify-between mt-4 2xl:w-full p-4 bg-white rounded'>
                    <div className=''>
                        {/* name address */}
                        <div className='flex items-center gap-x-4'>
                            {/* <p className='font-bold text-base '>Anh Hoang</p> */}

                            <Button
                                variant='outline'
                                onClick={() => handleSetAddressDefault(location._id)}
                                disabled={location.isDefault ? true : false}
                                className='h-6 border-red-500 text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white'>
                                {location.isDefault ? 'Địa chỉ mặc định' : 'Đặt làm địa chỉ mặc định'}
                            </Button>
                        </div>
                        {/* <p
                            className='font-light text-xs mt-4'>
                            {`Địa chỉ: ${formartLocation(location.province, location.district, location.ward, location.street)}`}
                        </p> */}
                        <p className='font-light text-xs mt-4'>
                            Địa chỉ: {getAddressName("province", location.province)}, {getAddressName("district", location.district)}, {getAddressName("commune", location.ward)}, {location.street}
                        </p>
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <Button
                            variant='outline'
                            className='text-gray-500 text-xs font-semibold hover:bg-red-500 hover:text-white'
                        >
                            Chỉnh sửa
                        </Button>
                        <Button
                            onClick={() => handleDeleteAddress(location._id)}
                            variant='outline'
                            className='border-red-500 outline-none text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white'>
                            Xóa
                        </Button>
                    </div>
                </div>
            ))}
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
                                {addressDataState.province.map((prov) => (
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
        </div>
    )
}

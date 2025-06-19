'use client'
import { Button } from '@/components/atoms/ui/Button';
import React, { useEffect, useState } from 'react'

interface IAddressData {
    province: IProvince[],
    district: IDistrict[],
    commune: ICommune[];
}

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

export default function AddressShippingForm() {

    const [addressData, setAddressData] = useState<IAddressData>({
        province: [],
        district: [],
        commune: []
    })
    const [districts, setDistricts] = useState<{ idProvince: string; idDistrict: string; name: string }[]>([])
    const [communes, setCommunes] = useState<{ idDistrict: string, idCommune: string, name: string }[]>([])

    const [selectedProvince, setSelectedProvince] = useState('')
    const [selectedDistrict, setSelectedDistrict] = useState('')
    const [selectedCommune, setSelectedCommune] = useState('')

    // get file address.json
    useEffect(() => {
        fetch('/data/address.json')
            .then(res => res.json())
            .then(data => {
                setAddressData(data)
            })
            .catch(err => 'Lỗi khi tải dữ liệu địa chỉ: ' + err.message)
    }, [])

    // filter quan/huyen khi chon tinh/tp
    useEffect(() => {
        if (selectedProvince) {
            const filteredDistricts = addressData.district.filter(
                (dist) => dist.idProvince === selectedProvince
            );
            setDistricts(filteredDistricts);
            // reset quan/phuong khi doi tinh
            setCommunes([]);
            setSelectedDistrict('');
            setSelectedCommune('');
        }
    }, [selectedProvince, addressData.district]);

    // loc phuong/xa kh chon huyen
    useEffect(() => {
        if (selectedDistrict) {
            const filteredCommunes = addressData.commune.filter(
                (comm) => comm.idDistrict === selectedDistrict
            );
            setCommunes(filteredCommunes);
            // Reset phuong/xa khi doi quan
            setSelectedCommune('');
        }
    }, [selectedDistrict, addressData.commune]);

    const handleAddAddress = () => {
        
    }

    return (

        <div>
            <div className="w-full p-4 bg-white rounded">
                {/* Dropdown Tỉnh/Thành phố */}
                <div className="mb-4">
                    <label className="block text-[11px] font-thin text-gray-400 uppercase">
                        Tỉnh/Thành phố
                    </label>
                    <select
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        className="w-full p-1 border-b-2 border-b-gray-700 outline-none text-gray-800 text-sm font-thin focus-within:border-b-blue-500"
                    >
                        <option value="">Chọn tỉnh/thành phố</option>
                        {addressData.province.map((prov) => (
                            <option key={prov.idProvince} value={prov.idProvince}>
                                {prov.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Dropdown Quận/Huyện */}
                <div className="mb-4">
                    <label className="block text-[11px] font-thin text-gray-400 uppercase">
                        Quận/Huyện
                    </label>
                    <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        disabled={!selectedProvince}
                        className="w-full p-1 border-b-2 border-b-gray-700 outline-none text-gray-800 text-sm font-thin focus-within:border-b-blue-500 disabled:opacity-50"
                    >
                        <option value="">Chọn quận/huyện</option>
                        {districts.map((dist) => (
                            <option key={dist.idDistrict} value={dist.idDistrict}>
                                {dist.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Dropdown Phường/Xã */}
                <div className="mb-4">
                    <label className="block text-[11px] font-thin text-gray-400 uppercase">
                        Phường/Xã
                    </label>
                    <select
                        value={selectedCommune}
                        onChange={(e) => setSelectedCommune(e.target.value)}
                        disabled={!selectedDistrict}
                        className="w-full p-1 border-b-2 border-b-gray-700 outline-none text-gray-800 text-sm font-thin focus-within:border-b-blue-500 disabled:opacity-50"
                    >
                        <option value="">Chọn phường/xã</option>
                        {communes.map((comm) => (
                            <option key={comm.idCommune} value={comm.idCommune}>
                                {comm.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Địa chỉ cụ thể */}
                <div className='mb-4'>
                    <label
                        htmlFor='detailAddress'
                        className="block text-[11px] font-thin text-gray-400 uppercase">
                        Địa chỉ cụ thể
                    </label>
                    <input
                        id='detailAddress'
                        className="w-full p-1 border-b-2 border-b-gray-700 outline-none text-gray-800 text-sm font-thin focus-within:border-b-blue-500 disabled:opacity-50"
                        type="text" />
                </div>

                <Button
                    onClick={handleAddAddress}
                    className='w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 ease-in-out'>
                    Thêm địa chỉ nhận hàng
                </Button>
            </div>
        </div>
    )
}

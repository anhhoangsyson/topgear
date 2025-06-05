import LaptopCardSecond from '@/app/admin/(otherPages)/laptop-group/LaptopCardSecond';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ILaptopGroup } from '@/types';
import React from 'react'
// import { ILaptopGroup } from '../../../../types/index';

type LaptopGroupProps = {
    open: boolean,
    onClose: () => void,
    laptopGroup: ILaptopGroup | null
}


export default function LaptopGroupDetail({ open, onClose, laptopGroup }: LaptopGroupProps) {

    if (!open || !laptopGroup) return null;

    return (
        <Dialog
            open={open} onOpenChange={onClose}>
            <DialogTitle>
                {laptopGroup.name}
            </DialogTitle>
            <DialogContent className="max-w-4xl">
                <h2 className='text-gray font-semibold text-2xl'>Bạn đang xem demo {laptopGroup.name}</h2>
                <div
                    className="w-full min-h-[400px] object-cover mb-8 p-4"
                    style={{
                        backgroundImage: `url(${laptopGroup.backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className='p-4'>
                        <h2 className='text-white font-semibold'>{laptopGroup.name}</h2>
                        <div className='my-2 h-[1px] bg-white w-full'></div>
                        <div className='grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
                            {laptopGroup.laptops.map((laptop) => (
                                <LaptopCardSecond
                                    key={laptop._id}
                                    laptop={laptop}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

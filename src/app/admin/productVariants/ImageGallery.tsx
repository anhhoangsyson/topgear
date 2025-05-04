import React, { useState } from 'react'

export default function ImageGallery({ images }: { images: { url: string }[] }) {

    const [mainImage, setMainImage] = useState<string>(images[0].url); 
    return (
        <div>
            <div className="mb-4">
                <img
                    src={images[0].url}
                    alt={'Main Image'}
                    className="rounded-lg w-full h-auto border"
                />
            </div>
            <div className="flex gap-2 overflow-x-auto">
                {images.map((img) => (
                    <img
                        key={img.url}
                        src={img.url}
                        className="w-16 h-16 cursor-pointer border rounded"
                        onClick={() => setMainImage(img.url)}
                    />
                ))}
            </div>
        </div>
    )
}

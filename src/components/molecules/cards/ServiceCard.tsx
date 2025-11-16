import Image from "next/image";
import type { StaticImageData } from "next/image";

interface ServiceCardProps {
  icon: StaticImageData | string;
  title: string;
  description: string;
}

export default function ServiceCard({
  icon,
  title,
  description,
}: ServiceCardProps) {
  return (
    <div className="bg-blue-50 p-3 sm:p-4 rounded-xl h-full">
      <div className="flex justify-center items-center w-12 h-12 sm:w-16 sm:h-16 rounded-md bg-blue-200 mx-auto">
        <Image
          src={icon || "/placeholder.svg"}
          alt={`${title}-icon`}
          width={40}
          height={40}
          className="w-8 h-8 sm:w-10 sm:h-10"
        />
      </div>
      <div className="pt-3 sm:pt-4">
        <h1 className="text-sm sm:text-base font-medium text-center">{title}</h1>
        <p className="pt-2 text-xs sm:text-sm font-normal text-center text-gray-500 line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
}

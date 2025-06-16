import Image from "next/image";
import type { StaticImageData } from "next/image";

interface ServiceCardProps {
  icon: StaticImageData;
  title: string;
  description: string;
}

export default function ServiceCard({
  icon,
  title,
  description,
}: ServiceCardProps) {
  return (
    <div className="bg-blue-50 p-4 rounded-xl">
      <div className="flex justify-center items-center w-16 h-16 rounded-md bg-blue-200">
        <Image
          src={icon || "/placeholder.svg"}
          alt={`${title}-icon`}
          width={40}
          height={40}
        />
      </div>
      <div className="pt-4">
        <h1 className="text-base font-medium text-left">{title}</h1>
        <p className="pt-2 text-sm font-normal text-left text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

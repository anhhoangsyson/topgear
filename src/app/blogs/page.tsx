import Image from "next/image";
import Link from "next/link";
import React from "react";
import img1 from "../../../public/1607431213-guide-to-finding-out-phone-name.avif";
import Wraper from "@/components/core/Wraper";
export default function BlogPage() {
  return (
    <Wraper>
      {/* bannersection */}
      <div className="py-24">
        <div className="text-center">
          <span className="text-5xl font-bold text-black text-center">
            Blog 8 Bit Store
          </span>
        </div>
        <p className="mt-3 text-center font-normal text-xl">
          Đọc blogs để hiểu thêm về san pham cua chúng tôi
        </p>
      </div>
      {/* blogsection */}
      <div className="grid grid-cols-4 gap-y-8 gap-x-8 my-9 py-32">
        <figure className="p-4 grid grid-cols-1 gap-y-2 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 py-8">
          <div className="">
            <Link href="/product/1">
              <Image
                className="h-auto"
                src={img1}
                alt="product"
                width={320}
                height={300}
              />
            </Link>
          </div>
          {/* blogs name and detail */}
          <div className="w-11/12 mx-auto pt-4">
            <h3 className="mt-2 text-lg font-bold">
              Tìm hiểu Laptop AI – So sánh Laptop AI với Laptop thườn
            </h3>

            <div className="mt-2 flex gap-4">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.33317 7.33341C7.17412 7.33341 8.6665 5.84103 8.6665 4.00008C8.6665 2.15913 7.17412 0.666748 5.33317 0.666748C3.49222 0.666748 1.99984 2.15913 1.99984 4.00008C1.99984 5.84103 3.49222 7.33341 5.33317 7.33341ZM5.33317 7.33341C6.67484 7.33341 7.84775 7.83969 8.68209 8.68241M5.33317 7.33341C2.6665 7.33341 0.666504 9.33341 0.666504 12.0001V15.3334H5.33317M15.3332 10.0001L13.3332 8.00008L9.33317 12.0001M11.6665 9.66675L13.6665 11.6667M6.6665 13.0001C6.6665 13.9201 7.41317 14.6667 8.33317 14.6667C9.25384 14.6667 9.99984 13.9201 9.99984 13.0001C9.99984 12.0794 9.25384 11.3334 8.33317 11.3334C7.41317 11.3334 6.6665 12.0794 6.6665 13.0001Z"
                  stroke="#4B5563"
                  strokeWidth="1.33333"
                />
              </svg>
              <span className="text-sm font-light text-gray-700">
                Đăng bởi: &nbsp;
                <p className=" inline-block font-bold text-red-500 text-sm">
                  Đăng Khoa
                </p>
              </span>
            </div>

            <div className="flex gap-4 mt-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.91473 0.333252C3.67896 0.333252 0.24707 3.76473 0.24707 7.99999C0.24707 12.2352 3.67896 15.6667 7.91473 15.6667C12.1505 15.6667 15.5824 12.2352 15.5824 7.99999C15.5824 3.76473 12.1505 0.333252 7.91473 0.333252ZM7.91473 14.1828C4.49829 14.1828 1.73113 11.416 1.73113 7.99999C1.73113 4.58396 4.49829 1.81714 7.91473 1.81714C11.3312 1.81714 14.0983 4.58396 14.0983 7.99999C14.0983 11.416 11.3312 14.1828 7.91473 14.1828ZM9.82546 10.9554L7.20052 9.04798C7.10468 8.97688 7.04902 8.86559 7.04902 8.74811V3.67199C7.04902 3.46796 7.21598 3.30102 7.42004 3.30102H8.40941C8.61347 3.30102 8.78043 3.46796 8.78043 3.67199V8.05254L10.8457 9.55497C11.0127 9.67554 11.0467 9.9074 10.9261 10.0743L10.3449 10.875C10.2243 11.0389 9.99241 11.076 9.82546 10.9554Z"
                  fill="#4B5563"
                />
              </svg>
              <p className="text-sm font-light">
                hời gian: lúc 15:45:52 18/12/2024
              </p>
            </div>
            <div className="mt-2">
              <i className="font-light text-sm">
                Nội dung: 1. Vietnam Web Summit (VWS) Vietnam Web Summit là sự
                kiện Công nghệ thường niên được tổ chức bởi
              </i>
            </div>
          </div>
        </figure>
        <figure className="p-4 grid grid-cols-1 gap-y-2 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 py-8">
          <div className="">
            <Link href="/product/1">
              <Image
                className="h-auto"
                src={img1}
                alt="product"
                width={320}
                height={300}
              />
            </Link>
          </div>
          {/* blogs name and detail */}
          <div className="w-11/12 mx-auto pt-4">
            <h3 className="mt-2 text-lg font-bold">
              Tìm hiểu Laptop AI – So sánh Laptop AI với Laptop thườn
            </h3>

            <div className="mt-2 flex gap-4">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.33317 7.33341C7.17412 7.33341 8.6665 5.84103 8.6665 4.00008C8.6665 2.15913 7.17412 0.666748 5.33317 0.666748C3.49222 0.666748 1.99984 2.15913 1.99984 4.00008C1.99984 5.84103 3.49222 7.33341 5.33317 7.33341ZM5.33317 7.33341C6.67484 7.33341 7.84775 7.83969 8.68209 8.68241M5.33317 7.33341C2.6665 7.33341 0.666504 9.33341 0.666504 12.0001V15.3334H5.33317M15.3332 10.0001L13.3332 8.00008L9.33317 12.0001M11.6665 9.66675L13.6665 11.6667M6.6665 13.0001C6.6665 13.9201 7.41317 14.6667 8.33317 14.6667C9.25384 14.6667 9.99984 13.9201 9.99984 13.0001C9.99984 12.0794 9.25384 11.3334 8.33317 11.3334C7.41317 11.3334 6.6665 12.0794 6.6665 13.0001Z"
                  stroke="#4B5563"
                  strokeWidth="1.33333"
                />
              </svg>
              <span className="text-sm font-light text-gray-700">
                Đăng bởi: &nbsp;
                <p className=" inline-block font-bold text-red-500 text-sm">
                  Đăng Khoa
                </p>
              </span>
            </div>

            <div className="flex gap-4 mt-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.91473 0.333252C3.67896 0.333252 0.24707 3.76473 0.24707 7.99999C0.24707 12.2352 3.67896 15.6667 7.91473 15.6667C12.1505 15.6667 15.5824 12.2352 15.5824 7.99999C15.5824 3.76473 12.1505 0.333252 7.91473 0.333252ZM7.91473 14.1828C4.49829 14.1828 1.73113 11.416 1.73113 7.99999C1.73113 4.58396 4.49829 1.81714 7.91473 1.81714C11.3312 1.81714 14.0983 4.58396 14.0983 7.99999C14.0983 11.416 11.3312 14.1828 7.91473 14.1828ZM9.82546 10.9554L7.20052 9.04798C7.10468 8.97688 7.04902 8.86559 7.04902 8.74811V3.67199C7.04902 3.46796 7.21598 3.30102 7.42004 3.30102H8.40941C8.61347 3.30102 8.78043 3.46796 8.78043 3.67199V8.05254L10.8457 9.55497C11.0127 9.67554 11.0467 9.9074 10.9261 10.0743L10.3449 10.875C10.2243 11.0389 9.99241 11.076 9.82546 10.9554Z"
                  fill="#4B5563"
                />
              </svg>
              <p className="text-sm font-light">
                hời gian: lúc 15:45:52 18/12/2024
              </p>
            </div>
            <div className="mt-2">
              <i className="font-light text-sm">
                Nội dung: 1. Vietnam Web Summit (VWS) Vietnam Web Summit là sự
                kiện Công nghệ thường niên được tổ chức bởi
              </i>
            </div>
          </div>
        </figure>
        <figure className="p-4 grid grid-cols-1 gap-y-2 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 py-8">
          <div className="">
            <Link href="/product/1">
              <Image
                className="h-auto"
                src={img1}
                alt="product"
                width={320}
                height={300}
              />
            </Link>
          </div>
          {/* blogs name and detail */}
          <div className="w-11/12 mx-auto pt-4">
            <h3 className="mt-2 text-lg font-bold">
              Tìm hiểu Laptop AI – So sánh Laptop AI với Laptop thườn
            </h3>

            <div className="mt-2 flex gap-4">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.33317 7.33341C7.17412 7.33341 8.6665 5.84103 8.6665 4.00008C8.6665 2.15913 7.17412 0.666748 5.33317 0.666748C3.49222 0.666748 1.99984 2.15913 1.99984 4.00008C1.99984 5.84103 3.49222 7.33341 5.33317 7.33341ZM5.33317 7.33341C6.67484 7.33341 7.84775 7.83969 8.68209 8.68241M5.33317 7.33341C2.6665 7.33341 0.666504 9.33341 0.666504 12.0001V15.3334H5.33317M15.3332 10.0001L13.3332 8.00008L9.33317 12.0001M11.6665 9.66675L13.6665 11.6667M6.6665 13.0001C6.6665 13.9201 7.41317 14.6667 8.33317 14.6667C9.25384 14.6667 9.99984 13.9201 9.99984 13.0001C9.99984 12.0794 9.25384 11.3334 8.33317 11.3334C7.41317 11.3334 6.6665 12.0794 6.6665 13.0001Z"
                  stroke="#4B5563"
                  strokeWidth="1.33333"
                />
              </svg>
              <span className="text-sm font-light text-gray-700">
                Đăng bởi: &nbsp;
                <p className=" inline-block font-bold text-red-500 text-sm">
                  Đăng Khoa
                </p>
              </span>
            </div>

            <div className="flex gap-4 mt-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.91473 0.333252C3.67896 0.333252 0.24707 3.76473 0.24707 7.99999C0.24707 12.2352 3.67896 15.6667 7.91473 15.6667C12.1505 15.6667 15.5824 12.2352 15.5824 7.99999C15.5824 3.76473 12.1505 0.333252 7.91473 0.333252ZM7.91473 14.1828C4.49829 14.1828 1.73113 11.416 1.73113 7.99999C1.73113 4.58396 4.49829 1.81714 7.91473 1.81714C11.3312 1.81714 14.0983 4.58396 14.0983 7.99999C14.0983 11.416 11.3312 14.1828 7.91473 14.1828ZM9.82546 10.9554L7.20052 9.04798C7.10468 8.97688 7.04902 8.86559 7.04902 8.74811V3.67199C7.04902 3.46796 7.21598 3.30102 7.42004 3.30102H8.40941C8.61347 3.30102 8.78043 3.46796 8.78043 3.67199V8.05254L10.8457 9.55497C11.0127 9.67554 11.0467 9.9074 10.9261 10.0743L10.3449 10.875C10.2243 11.0389 9.99241 11.076 9.82546 10.9554Z"
                  fill="#4B5563"
                />
              </svg>
              <p className="text-sm font-light">
                hời gian: lúc 15:45:52 18/12/2024
              </p>
            </div>
            <div className="mt-2">
              <i className="font-light text-sm">
                Nội dung: 1. Vietnam Web Summit (VWS) Vietnam Web Summit là sự
                kiện Công nghệ thường niên được tổ chức bởi
              </i>
            </div>
          </div>
        </figure>
        <figure className="p-4 grid grid-cols-1 gap-y-2 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 py-8">
          <div className="">
            <Link href="/product/1">
              <Image
                className="h-auto"
                src={img1}
                alt="product"
                width={320}
                height={300}
              />
            </Link>
          </div>
          {/* blogs name and detail */}
          <div className="w-11/12 mx-auto pt-4">
            <h3 className="mt-2 text-lg font-bold">
              Tìm hiểu Laptop AI – So sánh Laptop AI với Laptop thườn
            </h3>

            <div className="mt-2 flex gap-4">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.33317 7.33341C7.17412 7.33341 8.6665 5.84103 8.6665 4.00008C8.6665 2.15913 7.17412 0.666748 5.33317 0.666748C3.49222 0.666748 1.99984 2.15913 1.99984 4.00008C1.99984 5.84103 3.49222 7.33341 5.33317 7.33341ZM5.33317 7.33341C6.67484 7.33341 7.84775 7.83969 8.68209 8.68241M5.33317 7.33341C2.6665 7.33341 0.666504 9.33341 0.666504 12.0001V15.3334H5.33317M15.3332 10.0001L13.3332 8.00008L9.33317 12.0001M11.6665 9.66675L13.6665 11.6667M6.6665 13.0001C6.6665 13.9201 7.41317 14.6667 8.33317 14.6667C9.25384 14.6667 9.99984 13.9201 9.99984 13.0001C9.99984 12.0794 9.25384 11.3334 8.33317 11.3334C7.41317 11.3334 6.6665 12.0794 6.6665 13.0001Z"
                  stroke="#4B5563"
                  strokeWidth="1.33333"
                />
              </svg>
              <span className="text-sm font-light text-gray-700">
                Đăng bởi: &nbsp;
                <p className=" inline-block font-bold text-red-500 text-sm">
                  Đăng Khoa
                </p>
              </span>
            </div>

            <div className="flex gap-4 mt-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.91473 0.333252C3.67896 0.333252 0.24707 3.76473 0.24707 7.99999C0.24707 12.2352 3.67896 15.6667 7.91473 15.6667C12.1505 15.6667 15.5824 12.2352 15.5824 7.99999C15.5824 3.76473 12.1505 0.333252 7.91473 0.333252ZM7.91473 14.1828C4.49829 14.1828 1.73113 11.416 1.73113 7.99999C1.73113 4.58396 4.49829 1.81714 7.91473 1.81714C11.3312 1.81714 14.0983 4.58396 14.0983 7.99999C14.0983 11.416 11.3312 14.1828 7.91473 14.1828ZM9.82546 10.9554L7.20052 9.04798C7.10468 8.97688 7.04902 8.86559 7.04902 8.74811V3.67199C7.04902 3.46796 7.21598 3.30102 7.42004 3.30102H8.40941C8.61347 3.30102 8.78043 3.46796 8.78043 3.67199V8.05254L10.8457 9.55497C11.0127 9.67554 11.0467 9.9074 10.9261 10.0743L10.3449 10.875C10.2243 11.0389 9.99241 11.076 9.82546 10.9554Z"
                  fill="#4B5563"
                />
              </svg>
              <p className="text-sm font-light">
                hời gian: lúc 15:45:52 18/12/2024
              </p>
            </div>
            <div className="mt-2">
              <i className="font-light text-sm">
                Nội dung: 1. Vietnam Web Summit (VWS) Vietnam Web Summit là sự
                kiện Công nghệ thường niên được tổ chức bởi
              </i>
            </div>
          </div>
        </figure>
        <figure className="p-4 grid grid-cols-1 gap-y-2 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 py-8">
          <div className="">
            <Link href="/product/1">
              <Image
                className="h-auto"
                src={img1}
                alt="product"
                width={320}
                height={300}
              />
            </Link>
          </div>
          {/* blogs name and detail */}
          <div className="w-11/12 mx-auto pt-4">
            <h3 className="mt-2 text-lg font-bold">
              Tìm hiểu Laptop AI – So sánh Laptop AI với Laptop thườn
            </h3>

            <div className="mt-2 flex gap-4">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.33317 7.33341C7.17412 7.33341 8.6665 5.84103 8.6665 4.00008C8.6665 2.15913 7.17412 0.666748 5.33317 0.666748C3.49222 0.666748 1.99984 2.15913 1.99984 4.00008C1.99984 5.84103 3.49222 7.33341 5.33317 7.33341ZM5.33317 7.33341C6.67484 7.33341 7.84775 7.83969 8.68209 8.68241M5.33317 7.33341C2.6665 7.33341 0.666504 9.33341 0.666504 12.0001V15.3334H5.33317M15.3332 10.0001L13.3332 8.00008L9.33317 12.0001M11.6665 9.66675L13.6665 11.6667M6.6665 13.0001C6.6665 13.9201 7.41317 14.6667 8.33317 14.6667C9.25384 14.6667 9.99984 13.9201 9.99984 13.0001C9.99984 12.0794 9.25384 11.3334 8.33317 11.3334C7.41317 11.3334 6.6665 12.0794 6.6665 13.0001Z"
                  stroke="#4B5563"
                  strokeWidth="1.33333"
                />
              </svg>
              <span className="text-sm font-light text-gray-700">
                Đăng bởi: &nbsp;
                <p className=" inline-block font-bold text-red-500 text-sm">
                  Đăng Khoa
                </p>
              </span>
            </div>

            <div className="flex gap-4 mt-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.91473 0.333252C3.67896 0.333252 0.24707 3.76473 0.24707 7.99999C0.24707 12.2352 3.67896 15.6667 7.91473 15.6667C12.1505 15.6667 15.5824 12.2352 15.5824 7.99999C15.5824 3.76473 12.1505 0.333252 7.91473 0.333252ZM7.91473 14.1828C4.49829 14.1828 1.73113 11.416 1.73113 7.99999C1.73113 4.58396 4.49829 1.81714 7.91473 1.81714C11.3312 1.81714 14.0983 4.58396 14.0983 7.99999C14.0983 11.416 11.3312 14.1828 7.91473 14.1828ZM9.82546 10.9554L7.20052 9.04798C7.10468 8.97688 7.04902 8.86559 7.04902 8.74811V3.67199C7.04902 3.46796 7.21598 3.30102 7.42004 3.30102H8.40941C8.61347 3.30102 8.78043 3.46796 8.78043 3.67199V8.05254L10.8457 9.55497C11.0127 9.67554 11.0467 9.9074 10.9261 10.0743L10.3449 10.875C10.2243 11.0389 9.99241 11.076 9.82546 10.9554Z"
                  fill="#4B5563"
                />
              </svg>
              <p className="text-sm font-light">
                hời gian: lúc 15:45:52 18/12/2024
              </p>
            </div>
            <div className="mt-2">
              <i className="font-light text-sm">
                Nội dung: 1. Vietnam Web Summit (VWS) Vietnam Web Summit là sự
                kiện Công nghệ thường niên được tổ chức bởi
              </i>
            </div>
          </div>
        </figure>
      </div>
      {/* panigatation */}
      {/* <div className="flex justify-center gap-x-2">
                        <Link
                            className="flex justify-center px-4 py-2 flex-wrap gap-x-2 bg-blue-500 rounded-full"
                            href={'/'}>1
                        </Link>
                        <Link
                            className="flex justify-center px-4 py-2 flex-wrap gap-x-2 bg-gray-300 rounded-full"
                            href={'/'}>2
                        </Link>
                    </div> */}
    </Wraper>
  );
}

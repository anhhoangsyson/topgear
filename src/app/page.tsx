import Header from "@/app/components/Header";
import Image from "next/image";
import img1 from '../../public/1607431213-guide-to-finding-out-phone-name.avif'
import img2 from '../../public/5 reasons you should buy a mid range phone over an expensive one.webp'
import img3 from '../../public/34b5bf180145769.6505ae7623131.webp'
import img4 from '../../public/9481555.png'
import img5 from '../../public/chuyenphatnhanh.jpg'
import bookingonl from '../../public/bookingonline.png'
import cardgift from '../../public/cardgift.png'

import Link from "next/link";
import Footer from "@/app/components/Footer";
export default function Home() {
  return (
    <div>
      <Header />
      <div className="w-11/12 mx-auto">
        <div className="grid grid-cols-2 my-8">
          <div className="flex flex-col justify-center">
            <h3 className="text-4xl text-blue-500 font-semibold">Thương mại điện tử</h3>
            <p className="mt-3 w-9/12 break-words text-gray-500">Khám phá thế giới công nghệ với những sản phẩm đa dạng tại 8bit! Dù bạn là game thủ, người làm việc sáng tạo, hay chỉ đơn giản muốn nâng cấp chiếc máy tính cá nhân của mình, chúng tôi đều có các sản phẩm phù hợp. Các sản phẩm của chúng tôi đều được nhập khẩu chính hãng, bảo đảm chất lượng và đa dạng mẫu mã từ các thương hiệu uy tín như Apple, Dell, HP, Asus, và nhiều hãng khác.</p>
            <div>
              <button className="px-4 py-2 mt-3 text-white text-sm bg-blue-600 rounded-md uppercase">
                Mua hàng ngay
              </button>
            </div>
          </div>
          <div>
            <Image src={img1} alt="hero" width={800} height={400} />
          </div>
        </div>
        {/* san pham ban chay */}
        <div>
          <h2 className="text-center text-5xl font-bold text-blue-600">Sản phẩm bán chạy</h2>
          <div className="grid grid-cols-4 gap-y-8  my-9">
            <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
              <div className="h-[270px]">
                <Link href="/product/1">
                  <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                </Link>
              </div>
              {/* product name and detail */}
              <div className="w-11/12 mx-auto">
                <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
              </div>
              {/* product price */}
              <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                <p className="text-xs text-gray-500">Giá tiền: </p>
                <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
              </div>
              {/* product action */}
              <div className="flex justify-around">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
              </div>
            </figure>
            <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
              <div className="h-[270px]">
                <Link href="/product/1">
                  <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                </Link>
              </div>
              {/* product name and detail */}
              <div className="w-11/12 mx-auto">
                <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
              </div>
              {/* product price */}
              <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                <p className="text-xs text-gray-500">Giá tiền: </p>
                <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
              </div>
              {/* product action */}
              <div className="flex justify-around">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
              </div>
            </figure>
            <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
              <div className="h-[270px]">
                <Link href="/product/1">
                  <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                </Link>
              </div>
              {/* product name and detail */}
              <div className="w-11/12 mx-auto">
                <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
              </div>
              {/* product price */}
              <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                <p className="text-xs text-gray-500">Giá tiền: </p>
                <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
              </div>
              {/* product action */}
              <div className="flex justify-around">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
              </div>
            </figure>
            <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
              <div className="h-[270px]">
                <Link href="/product/1">
                  <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                </Link>
              </div>
              {/* product name and detail */}
              <div className="w-11/12 mx-auto">
                <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
              </div>
              {/* product price */}
              <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                <p className="text-xs text-gray-500">Giá tiền: </p>
                <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
              </div>
              {/* product action */}
              <div className="flex justify-around">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
              </div>
            </figure>
          </div>
        </div>
        {/*  dien thoai va loptap*/}
        <div className="grid grid-col-4 gap-y-8 my-9">
          {/* header section */}
          <div>
            <h2 className="text-center text-5xl font-bold text-blue-600">Sản phẩm bán chạy</h2>
            <h4 className="text-center text-xl font-light my-3">Các sản phẩm điện tử đang giảm giá</h4>
            {/* produdcts list */}
            <div className="grid grid-cols-4 gap-y-8 my-9">
              <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
                <div className="h-[270px]">
                  <Link href="/product/1">
                    <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                  <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
                </div>
              </figure>
              <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
                <div className="h-[270px]">
                  <Link href="/product/1">
                    <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                  <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
                </div>
              </figure>
              <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
                <div className="h-[270px]">
                  <Link href="/product/1">
                    <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                  <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
                </div>
              </figure>
              <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
                <div className="h-[270px]">
                  <Link href="/product/1">
                    <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                  <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
                </div>
              </figure>
              <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
                <div className="h-[270px]">
                  <Link href="/product/1">
                    <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                  <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
                </div>
              </figure>
              <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
                <div className="h-[270px]">
                  <Link href="/product/1">
                    <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                  <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
                </div>
              </figure>
              <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
                <div className="h-[270px]">
                  <Link href="/product/1">
                    <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                  <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
                </div>
              </figure>
              <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
                <div className="h-[270px]">
                  <Link href="/product/1">
                    <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                  <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
                </div>
              </figure>
            </div>
            {/* panigatation */}
            <div className="flex justify-center gap-x-2">
              <Link
                className="flex justify-center px-4 py-2 flex-wrap gap-x-2 bg-blue-500 rounded-full"
                href={'/'}>1
              </Link>
              <Link
                className="flex justify-center px-4 py-2 flex-wrap gap-x-2 bg-gray-300 rounded-full"
                href={'/'}>2
              </Link>
              <Link
                className="flex justify-center px-4 py-2 flex-wrap gap-x-2 bg-gray-300 rounded-full"
                href={'/'}>3
              </Link>
              <Link
                className="flex justify-center px-4 py-2 flex-wrap gap-x-2 bg-gray-300 rounded-full"
                href={'/'}>4
              </Link>
            </div>
          </div>
        </div>
        {/* banner 2 */}
        <div className="grid grid-cols-2 my-32 gap-x-8">
          {/* left banner */}
          <div>
            <Image src={img2} alt="hero" width={800} height={400} />
          </div>
          {/* right banner */}
          <div className="flex gap-9">
            <div className="flex flex-col gap-y-2 justify-center">
              <button className="w-3 h-3 rounded-full bg-blue-500">
              </button>
              <button className="w-3 h-3 rounded-full bg-gray-300">
              </button>
              <button className="w-3 h-3 rounded-full bg-gray-300">
              </button>
              <button className="w-3 h-3 rounded-full bg-gray-300">
              </button>
            </div>
            <div className="flex flex-col justify-center">
              <p className="mt-3 w-9/12 break-words text-gray-500">
                Đừng bỏ lỡ những chương trình khuyến mãi và ưu đãi đặc biệt tại Top Gear! Với mong muốn mang lại giá trị tốt nhất cho khách hàng, chúng tôi thường xuyên cập nhật các chương trình giảm giá, quà tặng và ưu đãi đặc biệt cho từng dòng sản phẩm. Hãy theo dõi trang web hoặc đăng ký nhận tin từ chúng tôi để không bỏ lỡ bất kỳ ưu đãi nào.
              </p>
              <div>
                <button className="px-4 py-2 mt-3 text-white text-sm bg-blue-600 rounded-md uppercase">
                  mua sắm apple watch ngay
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* san pham tivi va phu kien */}
        <div className="grid grid-col-4 gap-y-8 py-32">
          {/* header section */}
          <div>
            <h2 className="text-center text-5xl font-bold text-blue-600">Sản phẩm Tivi và Phụ kiện</h2>
            <h4 className="text-center text-xl font-light my-3">Các sản phẩm Tivi và Phụ kiện với giá ưu đãi</h4>
            {/* produdcts list */}
            <div className="grid grid-cols-4 gap-y-8 my-9">
              <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
                <div className="h-[270px]">
                  <Link href="/product/1">
                    <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                  <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
                </div>
              </figure>
              <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
                <div className="h-[270px]">
                  <Link href="/product/1">
                    <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                  <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
                </div>
              </figure>
              <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
                <div className="h-[270px]">
                  <Link href="/product/1">
                    <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                  <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
                </div>
              </figure>
              <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
                <div className="h-[270px]">
                  <Link href="/product/1">
                    <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                  <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
                </div>
              </figure>
              <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
                <div className="h-[270px]">
                  <Link href="/product/1">
                    <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                  <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
                </div>
              </figure>
              <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
                <div className="h-[270px]">
                  <Link href="/product/1">
                    <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                  <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
                </div>
              </figure>
              <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
                <div className="h-[270px]">
                  <Link href="/product/1">
                    <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                  <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
                </div>
              </figure>
              <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
                <div className="h-[270px]">
                  <Link href="/product/1">
                    <Image className="h-auto" src={img1} alt="product" width={320} height={300} />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">DIen thoai dep trai so 1 the gioo</p>
                  <p className="text-md font-normalF truncate" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.</p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600"> 135.000.000 VND</strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">Thêm vào giỏ hàng</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">Mua ngay</button>
                </div>
              </figure>
            </div>
            {/* panigatation */}
            <div className="flex justify-center gap-x-2">
              <Link
                className="flex justify-center px-4 py-2 flex-wrap gap-x-2 bg-blue-500 rounded-full"
                href={'/'}>1
              </Link>
              <Link
                className="flex justify-center px-4 py-2 flex-wrap gap-x-2 bg-gray-300 rounded-full"
                href={'/'}>2
              </Link>
            </div>
          </div>
        </div>
        {/* banner 3 */}
        <div className="grid grid-cols-1 gap-y-12">
          <Image
            className="h-[300px] w-full object-cover rounded-md"
            src={img3} alt="hero" width={800} height={300} />
          <div className="text-center">
            <p className="font-semibold text-3xl uppercase inline-block ">
              Khám phá các lựa chọn &nbsp;</p>
            <h1 className="font-semibold text-3xl uppercase text-blue-500 inline-block">laptop đẳng cấp &nbsp;</h1>
            <p className="font-semibold text-3xl uppercase inline-block">
              của chúng tôi
            </p>
          </div>
          <div className="grid grid-cols-3 gap-x-16">
            <div className="bg-gray-100 p-8 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-blue-200 flex justify-center items-center mx-auto">
                <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.8042 1.40504L8.08333 6.9217L1.99583 7.8092C0.904161 7.96754 0.466661 9.31337 1.25833 10.0842L5.66249 14.3759L4.62083 20.4384C4.43333 21.5342 5.58749 22.355 6.55416 21.8425L12 18.98L17.4458 21.8425C18.4125 22.3509 19.5667 21.5342 19.3792 20.4384L18.3375 14.3759L22.7417 10.0842C23.5333 9.31337 23.0958 7.96754 22.0042 7.8092L15.9167 6.9217L13.1958 1.40504C12.7083 0.421703 11.2958 0.409203 10.8042 1.40504Z" fill="#3B82F6" />
                </svg>
              </div>
              <div>
                <h2 className="mt-3 text-xl font-semibold">Bộ sưu tập laptop đẳng cấp</h2>
                <p className="mt-3 text-base text-gray-400">Mua sắm dễ dàng tại Top Gear với bộ sưu tập laptop đẳng cấp! Chúng tôi cung cấp nhiều mẫu từ các thương hiệu uy tín như Apple, Dell, HP, Lenovo, đáp ứng nhu cầu học tập, làm việc và giải trí.</p>
              </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-blue-200 flex justify-center items-center mx-auto">
                <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.8042 1.40504L8.08333 6.9217L1.99583 7.8092C0.904161 7.96754 0.466661 9.31337 1.25833 10.0842L5.66249 14.3759L4.62083 20.4384C4.43333 21.5342 5.58749 22.355 6.55416 21.8425L12 18.98L17.4458 21.8425C18.4125 22.3509 19.5667 21.5342 19.3792 20.4384L18.3375 14.3759L22.7417 10.0842C23.5333 9.31337 23.0958 7.96754 22.0042 7.8092L15.9167 6.9217L13.1958 1.40504C12.7083 0.421703 11.2958 0.409203 10.8042 1.40504Z" fill="#3B82F6" />
                </svg>
              </div>
              <div>
                <h2 className="mt-3 text-xl font-semibold">Trải nghiệm dịch vụ chuyên nghiệp
                </h2>
                <p className="mt-3 text-base text-gray-400">Dịch vụ hàng đầu tại Top Gear! Đội ngũ chuyên viên sẵn sàng tư vấn và hỗ trợ bạn chọn được chiếc laptop phù hợp với nhu cầu và ngân sách, cam kết bảo hành dài hạn và hỗ trợ sau bán hàng tuyệt vời.</p>
              </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-blue-200 flex justify-center items-center mx-auto">
                <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.8042 1.40504L8.08333 6.9217L1.99583 7.8092C0.904161 7.96754 0.466661 9.31337 1.25833 10.0842L5.66249 14.3759L4.62083 20.4384C4.43333 21.5342 5.58749 22.355 6.55416 21.8425L12 18.98L17.4458 21.8425C18.4125 22.3509 19.5667 21.5342 19.3792 20.4384L18.3375 14.3759L22.7417 10.0842C23.5333 9.31337 23.0958 7.96754 22.0042 7.8092L15.9167 6.9217L13.1958 1.40504C12.7083 0.421703 11.2958 0.409203 10.8042 1.40504Z" fill="#3B82F6" />
                </svg>
              </div>
              <div>
                <h2 className="mt-3 text-xl font-semibold">Giá cạnh tranh, ưu đãi hấp dẫn
                </h2>
                <p className="mt-3 text-base text-gray-400">Mua sắm dễ dàng tại Top Gear với bộ sưu tập laptop đẳng cấp! Chúng tôi cung cấp nhiều mẫu từ các thương hiệu uy tín như Apple, Dell, HP, Lenovo, đáp ứng nhu cầu học tập, làm việc và giải trí.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* banner 4 */}
        <div className="pt-12">
          <div>
            <h4 className="mt-2 text-base font-semibold text-blue-500">Dịch vụ của chúng tôi</h4>
            <h2 className="mt-2 text-3xl font-semibold">Đem đến trải nghiệm tốt nhất cho bạn</h2>
            <p className="mt-2 text-sm font-normal text-gray-500">Chúng tôi luôn sẵn sàng phục vụ với các dịch vụ chất lượng cao.</p>
          </div>
          <div className="mt-12 grid grid-cols-4 gap-x-8">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex justify-center items-center w-16 h-16 rounded-md bg-blue-200">
                <Image src={img4} alt="servier-icon" width={40} height={40} />
              </div>
              <div className="pt-4">
                <h1 className="text-base font-medium text-left">Dịch vụ</h1>
                <p className="pt-2 text-sm font-normal text-left text-gray-500">Đem đến sự hài lòng cho mọi người</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex justify-center items-center w-16 h-16 rounded-md bg-blue-200">
                <Image src={img5} alt="servier-icon" width={40} height={40} />
              </div>
              <div className="pt-4">
                <h1 className="text-base font-medium text-left">Chuyển phát nhanh</h1>
                <p className="pt-2 text-sm font-normal text-left text-gray-500">Chúng tôi giao hàng nhanh chóng đến tận nhà bạn</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex justify-center items-center w-16 h-16 rounded-md bg-blue-200">
                <Image src={bookingonl} alt="servier-icon" width={40} height={40} />
              </div>
              <div className="pt-4">
                <h1 className="text-base font-medium text-left">Đặt hàng trực tuyến</h1>
                <p className="pt-2 text-sm font-normal text-left text-gray-500">Khám phá sản phẩm công nghệ và đặt hàng một cách dễ dàng bằng cách sử dụng Đặt hàng trực tuyến của chúng tôi</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex justify-center items-center w-16 h-16 rounded-md bg-blue-200">
                <Image src={cardgift} alt="servier-icon" width={40} height={40} />
              </div>
              <div className="pt-4">
                <h1 className="text-base font-medium text-left">Thẻ quà tặng</h1>
                <p className="pt-2 text-sm font-normal text-left text-gray-500">Tặng quà ẩm thực đặc sắc với Thẻ quà tặng từ 8 bit store</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

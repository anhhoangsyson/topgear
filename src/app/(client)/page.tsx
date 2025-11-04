import Image from "next/image";
import img1 from "/public/1607431213-guide-to-finding-out-phone-name.avif";
import img2 from "/public/5 reasons you should buy a mid range phone over an expensive one.webp";
import img3 from "/public/34b5bf180145769.6505ae7623131.webp";
import img4 from "/public/9481555.png";
import img5 from "/public/chuyenphatnhanh.jpg";
import bookingOnl from "/public/bookingonline.png";
import cardGift from "/public/cardgift.png";
import CategorySection from "@/components/organisms/section/CategorySection/CategorySection";
import BrandSection from "@/components/organisms/section/BrandSection/BrandSection";
import LaptopGroupSection from "@/components/organisms/section/LaptopGroupSection/LaptopGroupSection";
import LaptopPromodSection from "@/components/organisms/section/LaptopPromodSection/LaptopPromodSection";
import SessionSyncer from "@/components/features/auth/components/SessionSyncer";
import BenefitCard from "@/components/molecules/cards/BenefitCard";
import ServiceCard from "@/components/molecules/cards/ServiceCard";



const services = [
  {
    icon: img4,
    title: "Dịch vụ",
    description: "Đem đến sự hài lòng cho mọi người",
  },
  {
    icon: img5,
    title: "Chuyển phát nhanh",
    description: "Chúng tôi giao hàng nhanh chóng đến tận nhà bạn",
  },
  {
    icon: bookingOnl,
    title: "Đặt hàng trực tuyến",
    description:
      "Khám phá sản phẩm công nghệ và đặt hàng một cách dễ dàng bằng cách sử dụng Đặt hàng trực tuyến của chúng tôi",
  },
  {
    icon: cardGift,
    title: "Thẻ quà tặng",
    description: "Tặng quà ẩm thực đặc sắc với Thẻ quà tặng từ E-COM",
  },
];

const benefits = [
  {
    title: "Bộ sưu tập laptop đẳng cấp",
    description:
      "Mua sắm dễ dàng tại E-COM với bộ sưu tập laptop đẳng cấp! Chúng tôi cung cấp nhiều mẫu từ các thương hiệu uy tín như Apple, Dell, HP, Lenovo, đáp ứng nhu cầu học tập, làm việc và giải trí.",
  },
  {
    title: "Trải nghiệm dịch vụ chuyên nghiệp",
    description:
      "Dịch vụ hàng đầu tại E-COM! Đội ngũ chuyên viên sẵn sàng tư vấn và hỗ trợ bạn chọn được chiếc laptop phù hợp với nhu cầu và ngân sách, cam kết bảo hành dài hạn và hỗ trợ sau bán hàng tuyệt vời.",
  },
  {
    title: "Giá cạnh tranh, ưu đãi hấp dẫn",
    description:
      "Mua sắm dễ dàng tại E-COM với bộ sưu tập laptop đẳng cấp! Chúng tôi cung cấp nhiều mẫu từ các thương hiệu uy tín như Apple, Dell, HP, Lenovo, đáp ứng nhu cầu học tập, làm việc và giải trí.",
  },
];

const contactInfo = [
  {
    title: "Email",
    subtitle: "Liên hệ với chúng tôi",
    contact: "topgearcontact@gmail.com",
  },
  {
    title: "Địa chỉ",
    subtitle: "CVPM QTRUNG, Q12, TP.HCM",
    contact: "nằm trong khu công viên phần mềm",
  },
  {
    title: "Số điện thoại liên hệ",
    subtitle: "Làm việc từ thứ 2 đến thứ 7 hàng tuần",
    contact: "0123456789",
  },
];


async function fetchBrands() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/brand/active`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  const data = await res.json();
  return data.data
}

async function fetchCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/category`, {
    method: "GET",
  })
  const data = await res.json();
  return data.data
}

async function fetchLaptopGroups() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/laptop-group`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  const data = await res.json();
  return data.data
}


async function fetctLaptopPromods() {
  // thay endpoint cua laptop promod vao day
  const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/laptop`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await res.json();
  return data.data
}

export default async function Home() {

  const brands = await fetchBrands();
  const categories = await fetchCategories();
  const laptopGroups = await fetchLaptopGroups();
  const laptopPromods = await fetctLaptopPromods();
  // call fetchProductVariants() above
  return (
    <>
      <SessionSyncer />
      <div className="bg-white">
        {/* Category Filter Bar */}
        <CategorySection
          categories={categories}
        />

        {/* Brand Section */}
        <BrandSection brands={brands} />

        {/* Laptop Group section */}
        <LaptopGroupSection
          laptopGroups={laptopGroups}
        />
        <LaptopPromodSection
          laptopPromods={laptopPromods}
        />

        <div className="mx-auto">
          {/* <FlashSaleSection
            bannerFlashSale1={bannerFlashSale1}
            data={FlashSale}
          /> */}

          {/* TV and accessories */}
          {/* <div className="grid grid-col-4 gap-y-8 py-28">
            <div>
              <h2 className="text-center text-5xl font-bold text-blue-600">
                Sản phẩm của E-COM
              </h2>
              <h4 className="text-center text-xl font-light my-3">
                Các sản phẩm và Phụ kiện với giá ưu đãi
              </h4>
              {/* Products list */}
          {/* <div
                className="grid xl:grid-cols-5 sm:grid-cols-3 md:grid-cols-4 gap-y-8 my-9"
              >
                {productVariants.data.map((variant: any, index: any) => (
                  <ProductCard key={`product-variant-${index}`} product={variant} />
                ))
                }
              </div>

              {/* Pagination */}
          {/* <Panigation totalPages={totalPages} page={page} /> */}
          {/* </div> */}
          {/* </div> */}

          <div className="grid grid-cols-2 my-8">
            <div className="flex flex-col justify-center">
              <h3 className="text-4xl text-blue-500 font-semibold">
                Thương mại điện tử
              </h3>
              <p className="mt-3 w-9/12 break-words text-gray-500">
                Khám phá thế giới công nghệ với những sản phẩm đa dạng tại 8bit!
                Dù bạn là game thủ, người làm việc sáng tạo, hay chỉ đơn giản muốn
                nâng cấp chiếc máy tính cá nhân của mình, chúng tôi đều có các sản
                phẩm phù hợp. Các sản phẩm của chúng tôi đều được nhập khẩu chính
                hãng, bảo đảm chất lượng và đa dạng mẫu mã từ các thương hiệu uy
                tín như Apple, Dell, HP, Asus, và nhiều hãng khác.
              </p>
              <div>
                <button className="px-4 py-2 mt-3 text-white text-sm bg-blue-600 rounded-md uppercase">
                  Mua hàng ngay
                </button>
              </div>
            </div>
            <div>
              <Image
                src={img1 || "/placeholder.svg"}
                alt="hero"
                width={800}
                height={400}
              />
            </div>
          </div>



          <div className="grid grid-cols-2 my-32 gap-x-8">
            {/* Left banner */}
            <div>
              <Image
                src={img2 || "/placeholder.svg"}
                alt="hero"
                width={800}
                height={400}
              />
            </div>
            {/* Right banner */}
            <div className="flex gap-9">
              <div className="flex flex-col gap-y-2 justify-center">
                {[0, 1, 2, 3].map((index) => (
                  <button
                    key={`dot-${index}`}
                    className={`w-3 h-3 rounded-full ${index === 0 ? "bg-blue-500" : "bg-gray-300"
                      }`}
                  />
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <p className="mt-3 w-9/12 break-words text-gray-500">
                  Đừng bỏ lỡ những chương trình khuyến mãi và ưu đãi đặc biệt tại
                  E-COM! Với mong muốn mang lại giá trị tốt nhất cho khách
                  hàng, chúng tôi thường xuyên cập nhật các chương trình giảm giá,
                  quà tặng và ưu đãi đặc biệt cho từng dòng sản phẩm. Hãy theo dõi
                  trang web hoặc đăng ký nhận tin từ chúng tôi để không bỏ lỡ bất
                  kỳ ưu đãi nào.
                </p>
                <div>
                  <button className="px-4 py-2 mt-3 text-white text-sm bg-blue-600 rounded-md uppercase">
                    mua sắm apple watch ngay
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Banner 3 */}
          <div className="grid grid-cols-1 gap-y-12">
            <Image
              className="h-[300px] w-full object-cover rounded-md"
              src={img3 || "/placeholder.svg"}
              alt="hero"
              width={800}
              height={300}
            />
            <div className="text-center">
              <p className="font-semibold text-3xl uppercase inline-block">
                Khám phá các lựa chọn &nbsp;
              </p>
              <h1 className="font-semibold text-3xl uppercase text-blue-500 inline-block">
                laptop đẳng cấp &nbsp;
              </h1>
              <p className="font-semibold text-3xl uppercase inline-block">
                của chúng tôi
              </p>
            </div>
            <div className="grid grid-cols-3 gap-x-16">
              {benefits.map((benefit, index) => (
                <BenefitCard
                  key={`benefit-${index}`}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </div>
          </div>

          {/* Services section */}
          <div className="pt-12">
            <div>
              <h4 className="mt-2 text-base font-semibold text-blue-500">
                Dịch vụ của chúng tôi
              </h4>
              <h2 className="mt-2 text-3xl font-semibold">
                Đem đến trải nghiệm tốt nhất cho bạn
              </h2>
              <p className="mt-2 text-sm font-normal text-gray-500">
                Chúng tôi luôn sẵn sàng phục vụ với các dịch vụ chất lượng cao.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-4 gap-x-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={`service-${index}`}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                />
              ))}
            </div>
          </div>

          {/* Contact section */}
          <div className="grid grid-cols-3 mt-24">
            <div className="col-span-1">
              <div>
                {contactInfo.map((info, index) => (
                  <div key={`contact-${index}`} className="mb-11">
                    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-blue-50">
                      <svg
                        width="18"
                        height="15"
                        viewBox="0 0 18 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.125 2.95508V11.7051C17.125 12.2024 16.9275 12.6793 16.5758 13.0309C16.2242 13.3825 15.7473 13.5801 15.25 13.5801H2.75C2.25272 13.5801 1.77581 13.3825 1.42417 13.0309C1.07254 12.6793 0.875 12.2024 0.875 11.7051V2.95508M17.125 2.95508C17.125 2.4578 16.9275 1.98088 16.5758 1.62925C16.2242 1.27762 15.7473 1.08008 15.25 1.08008H2.75C2.25272 1.08008 1.77581 1.27762 1.42417 1.62925C1.07254 1.98088 0.875 2.4578 0.875 2.95508M17.125 2.95508V3.15758C17.125 3.4777 17.0431 3.7925 16.887 4.07199C16.7309 4.35148 16.5059 4.58636 16.2333 4.75425L9.98333 8.60008C9.68767 8.78219 9.34725 8.87862 9 8.87862C8.65275 8.87862 8.31233 8.78219 8.01667 8.60008L1.76667 4.75508C1.4941 4.58719 1.26906 4.35232 1.11297 4.07282C0.95689 3.79333 0.874965 3.47853 0.875 3.15841V2.95508"
                          stroke="#3B82F6"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="mt-2 text-base font-bold">{info.title}</p>
                      <p className="mt-2 text-sm font-normal">{info.subtitle}</p>
                      <p className="mt-2 text-sm font-normal text-blue-400">
                        {info.contact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <div className="w-full h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1959.2173532270174!2d106.622246!3d10.854504!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bee0b0ef9e5%3A0x5b4da59e47aa97a8!2zQ8O0bmcgVmnDqm4gUGjhuqduIE3hu4FtIFF1YW5nIFRydW5n!5e0!3m2!1svi!2sus!4v1739176826639!5m2!1svi!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

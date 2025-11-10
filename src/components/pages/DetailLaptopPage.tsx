import { ILaptop } from "@/types";
import Wraper from "../core/Wraper";
import CardDetailLaptop from "@/components/molecules/cards/CardDetailProduct";
import LeftSideDetailLaptop from "@/components/molecules/cards/LeftSideDetailProduct";
import { ListRelatedLaptop } from "@/components/molecules/cards/ListRelatedLaptop";
import LaptopRatingSection from "@/components/molecules/rating/LaptopRatingSection";

const DetailLaptopPage = ({ data }: { data: ILaptop }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <Wraper>
        {/* Main Product Detail Section */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6 mb-8 lg:mb-12">
          <CardDetailLaptop data={data} />
          <LeftSideDetailLaptop data={data.specifications} />
        </div>

        {/* Rating Section */}
        <LaptopRatingSection laptopId={data._id} />

        {/* Related Products Section */}
        <ListRelatedLaptop
          excludeId={data._id}
          brandId={data.brandId._id}
          categoryId={data.categoryId._id}
        />
      </Wraper>
    </div>
  );
};

export default DetailLaptopPage

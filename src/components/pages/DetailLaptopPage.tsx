import { ILaptop } from "@/types";
import Wraper from "../core/Wraper";
import CardDetailLaptop from "@/components/molecules/cards/CardDetailProduct";
import LeftSideDetailLaptop from "@/components/molecules/cards/LeftSideDetailProduct";
import { ListRelatedLaptop } from "@/components/molecules/cards/ListRelatedLaptop";

const DetailLaptopPage = ({ data }: { data: ILaptop }) => {

  return (
    <Wraper className="mt-8">
      {/* detail product */}
      <div className="mt-7 flex flex-col md:justify-between items-start gap-5 md:flex-row">
        <CardDetailLaptop data={data} />
        <LeftSideDetailLaptop data={data.specifications} />
      </div>

      {/* related products */}
      <ListRelatedLaptop
        excludeId={data._id}
        brandId={data.brandId._id}
        categoryId={data.categoryId._id}
      />
    </Wraper>
  );
};

export default DetailLaptopPage

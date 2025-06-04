import { ILaptop } from "@/types";
import Wraper from "../core/Wraper";
import BreadCrumb from "./components/BreadCrumb";
import CardDetailLaptop from "@/components/productDetail/components/CardDetailProduct";
import LeftSideDetailLaptop from "@/components/productDetail/components/LeftSideDetailProduct";
import { ListRelatedLaptop } from "@/components/productDetail/components/ListRelatedLaptop";

const DetailLaptopPage = ({ data }: { data: ILaptop }) => {

  return (
    <Wraper className="mt-8">
      <BreadCrumb />
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

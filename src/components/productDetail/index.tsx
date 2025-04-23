import { ProductVariantDetail } from "@/types";
import Wraper from "../core/Wraper";
import BreadCrumb from "./components/BreadCrumb";
import CardDetailProduct from "./components/CardDetailProduct";
import LeftSideDetailProduct from "./components/LeftSideDetailProduct";
import { ListRelatedProduct } from "./components/ListRelatedProduct";

const DetailProductPage = ({ data }: { data: ProductVariantDetail }) => {

  return (
    <Wraper className="mt-8">
      <BreadCrumb />
      {/* detail product */}
      <div className="mt-7 flex flex-col md:justify-between items-start gap-5 md:flex-row">
        <CardDetailProduct data={data}/>
        <LeftSideDetailProduct data={data.variantAttributes as [] } />
      </div>

      {/* related products */}
      <ListRelatedProduct id={data._id} />
    </Wraper>
  );
};

export default DetailProductPage;

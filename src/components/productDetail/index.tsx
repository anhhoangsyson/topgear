import Wraper from "../core/Wraper";
import BreadCrumb from "./components/BreadCrumb";
import CardDetailProduct from "./components/CardDetailProduct";
import LeftSideDetailProduct from "./components/LeftSideDetailProduct";
import { ListRelatedProduct } from "./components/ListRelatedProduct";

const DetailProductPage = () => {
  return (
    <Wraper className="mt-8">
      <BreadCrumb />
      {/* detail product */}
      <div className="mt-7 flex flex-col md:justify-between items-start gap-5 md:flex-row">
        <CardDetailProduct />
        <LeftSideDetailProduct />
      </div>

      {/* related products */}
      <ListRelatedProduct />
    </Wraper>
  );
};

export default DetailProductPage;

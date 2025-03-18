import Link from "next/link";

const Category = ({ label, link }: Category) => {
  return <Link href={link}>{label}</Link>;
};

export default Category;

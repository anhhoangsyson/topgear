interface FlashSaleProductCardProps {
  data: string;
}

export default function FlashSaleProductCard({
  data,
}: FlashSaleProductCardProps) {
  return (
    <div className="p-4">
      <p>{data && "Flash Sale Products will be displayed here"}</p>
    </div>
  );
}

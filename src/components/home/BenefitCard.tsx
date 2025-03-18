interface BenefitCardProps {
  title: string;
  description: string;
}

export default function BenefitCard({ title, description }: BenefitCardProps) {
  return (
    <div className="bg-gray-100 p-8 rounded-xl">
      <div className="w-12 h-12 rounded-full bg-blue-200 flex justify-center items-center mx-auto">
        <svg
          width="24"
          height="22"
          viewBox="0 0 24 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.8042 1.40504L8.08333 6.9217L1.99583 7.8092C0.904161 7.96754 0.466661 9.31337 1.25833 10.0842L5.66249 14.3759L4.62083 20.4384C4.43333 21.5342 5.58749 22.355 6.55416 21.8425L12 18.98L17.4458 21.8425C18.4125 22.3509 19.5667 21.5342 19.3792 20.4384L18.3375 14.3759L22.7417 10.0842C23.5333 9.31337 23.0958 7.96754 22.0042 7.8092L15.9167 6.9217L13.1958 1.40504C12.7083 0.421703 11.2958 0.409203 10.8042 1.40504Z"
            fill="#3B82F6"
          />
        </svg>
      </div>
      <div>
        <h2 className="mt-3 text-xl font-semibold">{title}</h2>
        <p className="mt-3 text-base text-gray-400">{description}</p>
      </div>
    </div>
  );
}

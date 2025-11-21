export default function ProductCard({ title, description, features, price }) {
  return (
    <div className="flex flex-col bg-[#2d2d2d] rounded-xl border-2 border-[#4CAF50] overflow-hidden">
      <div className="flex items-center justify-center p-5 bg-[#3d3d3d] border-b-2 border-[#4CAF50]">
        <h2 className="text-[#4CAF50] text-xl font-semibold text-center">{title}</h2>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <p className="text-[#cccccc] mb-4 leading-relaxed">{description}</p>
        <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
          {features.map((feature, index) => (
            <li
              key={index}
              className="p-2.5 bg-[#3d3d3d] rounded-md text-white border-l-[3px] border-[#4CAF50]"
            >
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-center p-5 bg-[#3d3d3d] border-t-2 border-[#4CAF50]">
        <span className="text-[#4CAF50] text-xl font-bold">{price}</span>
      </div>
    </div>
  );
}


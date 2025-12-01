export default function ProductCard({ title, description, features, price }) {
  return (
    <div className="flex flex-col bg-[#2d2d2d] rounded-xl border-2 border-[#4CAF50] overflow-hidden transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-[#4CAF50]/30 hover:scale-[1.02]">
      <div className="flex items-center justify-center p-4 sm:p-5 bg-[#3d3d3d] border-b-2 border-[#4CAF50]">
        <h2 className="text-[#4CAF50] text-lg sm:text-xl font-semibold text-center">{title}</h2>
      </div>
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <p className="text-[#cccccc] mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{description}</p>
        <ul className="flex flex-col gap-2 sm:gap-2.5 list-none p-0 m-0">
          {features.map((feature, index) => (
            <li
              key={index}
              className="p-2 sm:p-2.5 bg-[#3d3d3d] rounded-md text-white text-sm sm:text-base border-l-[3px] border-[#4CAF50] hover:bg-[#4d4d4d] transition-colors"
            >
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-center p-4 sm:p-5 bg-[#3d3d3d] border-t-2 border-[#4CAF50]">
        <span className="text-[#4CAF50] text-lg sm:text-xl font-bold">{price}</span>
      </div>
    </div>
  );
}


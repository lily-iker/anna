import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section
      className="relative bg-cover bg-center h-[500px] grid grid-cols-12 items-center px-4"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/dr4kiyshe/image/upload/v1738244776/dam_vinh_hung_kkvsgx.jpg')",
        backgroundPosition: "center right",
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Text Content: Full width on small screens, col-start-2 to 5 on md+ */}
      <div className="col-span-12 md:col-span-5 md:col-start-2 relative z-10 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Tổng kho trái cây nhập khẩu uy tín hàng đầu
        </h1>
        <p className="text-lg text-gray-500 mb-6">
          Khám phá ngay những sản phẩm tươi ngon nhất của chúng tôi
        </p>
        <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-4xl w-48">Chi tiết</Button>
      </div>
    </section>
  );
}

export default function LearnMore() {
  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-md">
      {/* Background image */}
      <img
        src="/image/banner-bg.png"
        alt="Anna Shop Banner"
        className="w-full h-full object-cover"
      />

      {/* Floating card */}
      <div className="absolute bottom-4 left-4 sm:bottom-10 sm:left-10 md:bottom-16 md:left-16 bg-[#FFF3B0] rounded-xl px-4 py-2 sm:px-6 sm:py-3 shadow-lg flex items-center gap-2 sm:gap-3">
        <span className="text-xs sm:text-sm md:text-base font-medium text-[#6B4C3B]">
          Tìm hiểu thêm, liên hệ: <strong>038 623 6288</strong>
        </span>
        <a href="https://zalo.me" target="_blank" rel="noopener noreferrer">
          <img
            src="/image/zalo-icon.png"
            className="s-5 sm:s-6"
          />
        </a>
      </div>
    </div>
  )
}

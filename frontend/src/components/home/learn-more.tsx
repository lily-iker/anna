import { memo } from 'react'
import ResponsiveImage from './responsive-image'

function LearnMore() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-md">
      <ResponsiveImage
        src="https://res.cloudinary.com/dnvyuomtd/image/upload/v1742787800/bannerblog2_qjoqhn_uvzqab.jpg"
        alt="Anna Shop Banner"
        aspectRatio="30/9"
        objectFit="cover"
      />

      {/* Floating card */}
      <div className="absolute bottom-4 left-4 sm:bottom-10 sm:left-10 md:bottom-16 md:left-16 bg-[#FFF3B0] rounded-xl px-4 py-2 sm:px-6 sm:py-3 shadow-lg flex items-center gap-2 sm:gap-3">
        <span className="text-xs sm:text-sm md:text-base font-medium text-[#6B4C3B]">
          Tìm hiểu thêm, liên hệ: <strong>038 623 6288</strong>
        </span>
        <a href="https://zalo.me" target="_blank" rel="noopener noreferrer">
          <img
            src="https://res.cloudinary.com/dr4kiyshe/image/upload/v1742799702/zalo-icon_utkta5.png"
            className="s-3 sm:s-4"
            loading="lazy"
            width="24"
            height="24"
            alt="Zalo"
          />
        </a>
      </div>
    </div>
  )
}

// Export the memoized version
export default memo(LearnMore)

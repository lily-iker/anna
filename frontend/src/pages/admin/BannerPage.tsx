import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useBannerStore from '@/stores/useBannerStore'
import { Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BannerPage() {
  const navigate = useNavigate()
  const { topBanners, aboutUsBanners, fetchTopBanners, fetchAboutUsBanners, isLoading } =
    useBannerStore()

  useEffect(() => {
    fetchTopBanners()
    fetchAboutUsBanners()
  }, [fetchTopBanners, fetchAboutUsBanners])

  const handleEditBanner = (bannerId: number) => {
    navigate(`/admin/banners/edit/${bannerId}`)
  }

  if (isLoading && topBanners.length === 0 && aboutUsBanners.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Đang tải banner...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Banner</h1>

      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-3 border-b">
          <h2 className="font-medium">Vị trí banner</h2>
        </div>

        {/* Top Banners */}
        {topBanners.map((banner) => (
          <div key={banner.id} className="flex justify-between items-center px-6 py-4 border-b">
            <span>{banner.title}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/admin/banners/edit/${banner.id}`)}
              className="hover:cursor-pointer"
            >
              <Edit className="h-4 w-4 text-orange-500" />
            </Button>
          </div>
        ))}

        {/* About Us Banners */}
        {aboutUsBanners.map((banner) => (
          <div
            key={banner.id}
            className="flex justify-between items-center px-6 py-4 border-b last:border-b-0"
          >
            <span>{banner.title}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/admin/banners/edit/${banner.id}`)}
              className="hover:cursor-pointer"
            >
              <Edit className="h-4 w-4 text-orange-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

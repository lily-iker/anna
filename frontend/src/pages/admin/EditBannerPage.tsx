import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import useBannerStore from '@/stores/useBannerStore'
import type { Banner } from '@/types'

export default function EditBannerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    topBanners,
    aboutUsBanners,
    fetchTopBanners,
    fetchAboutUsBanners,
    updateBannerImage,
    isLoading,
  } = useBannerStore()

  const [banner, setBanner] = useState<Banner | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string>('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchTopBanners()
    fetchAboutUsBanners()
  }, [fetchTopBanners, fetchAboutUsBanners])

  useEffect(() => {
    if (id && (topBanners.length > 0 || aboutUsBanners.length > 0)) {
      const bannerId = Number.parseInt(id)
      const foundBanner = [...topBanners, ...aboutUsBanners].find((b) => b.id === bannerId) || null

      if (foundBanner) {
        setBanner(foundBanner)
        setPreviewImage(foundBanner.thumbnailImage)
      }
    }
  }, [id, topBanners, aboutUsBanners])

  useEffect(() => {
    const dropArea = dropAreaRef.current
    if (!dropArea) return

    const preventDefaults = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const highlight = () => dropArea.classList.add('border-orange-500')
    const unhighlight = () => dropArea.classList.remove('border-orange-500')

    const handleDrop = (e: DragEvent) => {
      preventDefaults(e)
      unhighlight()

      const dt = e.dataTransfer
      const file = dt?.files[0]
      if (file) {
        setImageFile(file)

        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewImage(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }

    const events = ['dragenter', 'dragover', 'dragleave', 'drop']
    events.forEach((e) => dropArea.addEventListener(e, preventDefaults, false))
    events.slice(0, 2).forEach((e) => dropArea.addEventListener(e, highlight, false))
    events.slice(2).forEach((e) => dropArea.addEventListener(e, unhighlight, false))
    dropArea.addEventListener('drop', handleDrop as EventListener, false)

    return () => {
      events.forEach((e) => dropArea.removeEventListener(e, preventDefaults, false))
      events.slice(0, 2).forEach((e) => dropArea.removeEventListener(e, highlight, false))
      events.slice(2).forEach((e) => dropArea.removeEventListener(e, unhighlight, false))
      dropArea.removeEventListener('drop', handleDrop as EventListener, false)
    }
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveChanges = async () => {
    if (!banner || !imageFile) return

    await updateBannerImage(banner.id, imageFile)
    navigate('/admin/banners')
  }

  const handleCancel = () => {
    navigate('/admin/banners')
  }

  if (!banner) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Đang tải thông tin banner...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{banner.title}</h1>

      <div className="border rounded-lg p-6 space-y-4">
        <div>
          <Label htmlFor="banner-image" className="text-sm font-medium">
            Hình ảnh <span className="text-red-500">*</span>
          </Label>
          <div
            ref={dropAreaRef}
            className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6 text-center transition-colors duration-200 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewImage ? (
              <div className="flex flex-col items-center">
                <img
                  src={previewImage || '/placeholder.svg'}
                  alt={`${banner.title} preview`}
                  className="h-32 object-contain mb-2 rounded-md"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Kéo & Thả các tập tin của bạn hoặc{' '}
                  <span className="text-orange-500">Tải lên</span>
                </p>
              </div>
            ) : (
              <div className="py-8">
                <p className="text-sm text-gray-500">
                  Kéo & Thả các tập tin của bạn hoặc{' '}
                  <span className="text-orange-500">Tải lên</span>
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              id="banner-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-2 mt-6">
        <Button
          onClick={handleSaveChanges}
          disabled={!imageFile || isLoading}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isLoading ? 'Đang xử lý...' : 'Lưu thay đổi'}
        </Button>
        <Button variant="outline" onClick={handleCancel}>
          Hủy bỏ
        </Button>
      </div>
    </div>
  )
}

'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import useCategoryStore from '@/stores/useCategoryStore'
import toast from 'react-hot-toast'

export default function CategoryImagePage() {
  const { categories, fetchCategories, updateCategoryImages, isLoading } = useCategoryStore()

  // Track image files and previews for each category
  const [imageFiles, setImageFiles] = useState<Record<number, File | null>>({})
  const [previewImages, setPreviewImages] = useState<Record<number, string>>({})
  const [hasChanges, setHasChanges] = useState(false)

  // Refs for file inputs and drop areas
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({})
  const dropAreaRefs = useRef<Record<number, HTMLDivElement | null>>({})

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    // Initialize preview images from fetched categories
    if (categories.length > 0) {
      const previews: Record<number, string> = {}
      categories.forEach((category) => {
        if (category.thumbnailImage) {
          previews[category.id] = category.thumbnailImage
        }
      })
      setPreviewImages(previews)
    }
  }, [categories])

  useEffect(() => {
    // Check if there are any changes
    const changedCategories = Object.keys(imageFiles).filter(
      (id) => imageFiles[Number(id)] !== null
    )
    setHasChanges(changedCategories.length > 0)
  }, [imageFiles])

  useEffect(() => {
    // Set up drag and drop for each category
    categories.forEach((category) => {
      const dropArea = dropAreaRefs.current[category.id]
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
          handleImageChange(category.id, file)
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
    })
  }, [categories])

  const handleImageUpload = (categoryId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageChange(categoryId, file)
    }
  }

  const handleImageChange = (categoryId: number, file: File) => {
    // Update the image file state
    setImageFiles((prev) => ({
      ...prev,
      [categoryId]: file,
    }))

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImages((prev) => ({
        ...prev,
        [categoryId]: reader.result as string,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSaveChanges = async () => {
    // Get all category IDs and files that have changes
    const categoryIds: number[] = []
    const files: File[] = []

    Object.entries(imageFiles).forEach(([id, file]) => {
      if (file) {
        categoryIds.push(Number(id))
        files.push(file)
      }
    })

    if (categoryIds.length === 0) {
      toast.error('Không có thay đổi để lưu')
      return
    }

    await updateCategoryImages(categoryIds, files)

    // Reset the image files state after successful update
    setImageFiles({})
  }

  const handleCancel = () => {
    // Reset to original images for all categories
    setImageFiles({})

    const previews: Record<number, string> = {}
    categories.forEach((category) => {
      if (category.thumbnailImage) {
        previews[category.id] = category.thumbnailImage
      }
    })
    setPreviewImages(previews)
  }

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Đang tải danh mục...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Ảnh danh mục</h1>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.id} className="border rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">{category.name}</h2>

            <div>
              <Label htmlFor={`image-${category.id}`} className="text-sm font-medium">
                Hình ảnh <span className="text-red-500">*</span>
              </Label>
              <div
                ref={(el) => (dropAreaRefs.current[category.id] = el)}
                className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6 text-center transition-colors duration-200 cursor-pointer"
                onClick={() => fileInputRefs.current[category.id]?.click()}
              >
                {previewImages[category.id] ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={previewImages[category.id] || '/placeholder.svg'}
                      alt={`${category.name} preview`}
                      className="h-32 object-contain mb-2"
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
                  ref={(el) => (fileInputRefs.current[category.id] = el)}
                  id={`image-${category.id}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(category.id, e)}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2 mt-6">
        <Button
          onClick={handleSaveChanges}
          disabled={!hasChanges || isLoading}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isLoading ? 'Đang xử lý...' : 'Lưu thay đổi'}
        </Button>
        <Button variant="outline" onClick={handleCancel} disabled={!hasChanges}>
          Hủy bỏ
        </Button>
      </div>
    </div>
  )
}

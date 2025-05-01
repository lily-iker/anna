'use client'

import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useProductStore from '@/stores/useProductStore'
import useCategoryStore from '@/stores/useCategoryStore'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { updateProduct, fetchProductById, deleteProducts, isLoading } = useProductStore()
  const { categories, fetchCategories } = useCategoryStore()

  // Local state for current product
  const [currentProduct, setCurrentProduct] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryName: '',
    unit: '',
    originalPrice: 0,
    sellingPrice: 0,
    discountPercentage: 0,
    stock: 0,
    minUnitToOrder: 1,
    origin: '',
    removedImageUrls: [] as string[],
  })
  const [discountPrice, setDiscountPrice] = useState<number>(0)

  // Thumbnail image state
  const [thumbnailImageFile, setThumbnailImageFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null)
  const thumbnailDropAreaRef = useRef<HTMLDivElement>(null)

  // Multiple images state
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const imagesFileInputRef = useRef<HTMLInputElement>(null)
  const imagesDropAreaRef = useRef<HTMLDivElement>(null)

  // Fetch product data when ID changes
  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          const product = await fetchProductById(id)
          setCurrentProduct(product)
        } catch (error) {
          console.error('Failed to fetch product:', error)
        }
      }
    }

    loadProduct()
    fetchCategories()
  }, [id, fetchProductById, fetchCategories])

  // Update form data when current product changes
  useEffect(() => {
    if (currentProduct) {
      setFormData({
        name: currentProduct.name || '',
        description: currentProduct.description || '',
        categoryName: currentProduct.categoryName || '',
        unit: currentProduct.unit || '',
        originalPrice: currentProduct.originalPrice || 0,
        sellingPrice: currentProduct.sellingPrice || 0,
        discountPercentage: currentProduct.discountPercentage || 0,
        stock: currentProduct.stock || 0,
        minUnitToOrder: currentProduct.minUnitToOrder || 1,
        origin: currentProduct.origin || '',
        removedImageUrls: [] as string[],
      })

      // Calculate discount price
      const discounted =
        currentProduct.sellingPrice * (1 - (currentProduct.discountPercentage || 0) / 100)
      setDiscountPrice(Number.parseFloat(discounted.toFixed(2)))

      // Set thumbnail preview from current product
      if (currentProduct.thumbnailImage) {
        setThumbnailPreview(currentProduct.thumbnailImage)
      }

      // Set existing images from current product
      if (currentProduct.images && currentProduct.images.length > 0) {
        setExistingImages(currentProduct.images)
      }
    }
  }, [currentProduct])

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let numValue = Number(value)

    // Ensure values are not negative
    if (numValue < 0) {
      numValue = 0
    }

    // Clamp discount percentage to 100
    if (name === 'discountPercentage' && numValue > 100) {
      numValue = 100
    }

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: numValue }
      const discount = updatedFormData.discountPercentage || 0
      const sellingPrice = updatedFormData.sellingPrice || 0

      if (name === 'discountPercentage' || name === 'sellingPrice') {
        // Update discount price based on selling price and discount percentage
        const discounted = sellingPrice * (1 - discount / 100)
        setDiscountPrice(Number.parseFloat(discounted.toFixed(2)))
      }

      return updatedFormData
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'origin') {
      // Remove any numbers from the input
      const filteredValue = value.replace(/[0-9]/g, '')
      setFormData((prev) => ({
        ...prev,
        [name]: filteredValue,
      }))
      return
    }

    // Add validation for stock and minUnitToOrder
    if (name === 'stock' && Number(value) < 0) {
      return // Don't update if stock is negative
    }

    if (name === 'minUnitToOrder' && Number(value) < 1) {
      return // Don't update if minUnitToOrder is less than 1
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes('Price') ||
        name === 'stock' ||
        name === 'minUnitToOrder' ||
        name === 'discountPercentage'
          ? Number.parseFloat(value) || 0
          : value,
    }))
  }

  const handleDescriptionChange = (html: string) => {
    setFormData((prev) => ({
      ...prev,
      description: html,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (id) {
      // Create FormData object
      const productFormData = new FormData()

      // Add product data as JSON
      const productRequest = JSON.stringify(formData)
      productFormData.append('product', new Blob([productRequest], { type: 'application/json' }))

      if (formData.name === '') {
        toast.error('Vui lòng nhập tên sản phẩm')
        return
      }

      if (formData.categoryName === '') {
        toast.error('Vui lòng chọn danh mục sản phẩm')
        return
      }

      if (formData.description.replace(/<[^>]*>/g, '').trim() === '') {
        toast.error('Vui lòng nhập mô tả sản phẩm')
        return
      }

      if (formData.unit === '') {
        toast.error('Vui lòng chọn đơn vị sản phẩm')
        return
      }

      if (formData.originalPrice <= 0) {
        toast.error('Vui lòng nhập giá nhập sản phẩm')
        return
      }

      if (formData.sellingPrice <= 0) {
        toast.error('Vui lòng nhập giá bán sản phẩm')
        return
      }

      if (formData.discountPercentage < 0) {
        toast.error('Phần trăm triết khấu không được âm')
        return
      }

      if (formData.stock < 0) {
        toast.error('Tình trạng hàng không được âm')
        return
      }

      if (formData.minUnitToOrder < 1) {
        toast.error('Điều kiện đặt hàng không được nhỏ hơn 1')
        return
      }

      if (formData.origin === '') {
        toast.error('Vui lòng nhập xuất xứ sản phẩm')
        return
      }

      if (formData.discountPercentage > 100) {
        toast.error('Phần trăm triết khấu không được lớn hơn 100')
        return
      }

      // Add thumbnail image if changed
      if (thumbnailImageFile) {
        productFormData.append('thumbnailImageFile', thumbnailImageFile)
      }

      // Add new image files if any
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          productFormData.append('imageFiles', file)
        })
      }

      const result = await updateProduct(id, productFormData)
      if (result) {
        navigate('/admin/products')
      }
    }
  }

  const handleDelete = async () => {
    if (id && window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      await deleteProducts([id])
      navigate('/admin/products')
    }
  }

  // Thumbnail image handling
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Multiple images handling
  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files)
      setImageFiles((prev) => [...prev, ...newFiles])

      // Create previews for new files
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    const imageToRemove = existingImages[index]

    // Add the removed image URL to the removedImageUrls array in formData
    setFormData((prev) => ({
      ...prev,
      removedImageUrls: [...prev.removedImageUrls, imageToRemove],
    }))

    // Remove from existingImages state for UI update
    setExistingImages((prev) => {
      const updatedImages = [...prev]
      updatedImages.splice(index, 1)
      return updatedImages
    })
  }

  // Thumbnail drop area setup
  useEffect(() => {
    const dropArea = thumbnailDropAreaRef.current
    if (!dropArea) return

    const preventDefaults = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const highlight = () => {
      dropArea.classList.add('border-orange-500')
    }

    const unhighlight = () => {
      dropArea.classList.remove('border-orange-500')
    }

    const handleDrop = (e: DragEvent) => {
      preventDefaults(e)
      unhighlight()

      const dt = e.dataTransfer
      if (!dt) return

      const files = dt.files
      if (files.length) {
        const file = files[0]
        setThumbnailImageFile(file)

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
          setThumbnailPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }

    // Event listeners
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false)
    })
    ;['dragenter', 'dragover'].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false)
    })
    ;['dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, unhighlight, false)
    })

    dropArea.addEventListener('drop', handleDrop as EventListener, false)

    // Cleanup function
    return () => {
      ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        dropArea.removeEventListener(eventName, preventDefaults, false)
      })
      ;['dragenter', 'dragover'].forEach((eventName) => {
        dropArea.removeEventListener(eventName, highlight, false)
      })
      ;['dragleave', 'drop'].forEach((eventName) => {
        dropArea.removeEventListener(eventName, unhighlight, false)
      })

      dropArea.removeEventListener('drop', handleDrop as EventListener, false)
    }
  }, [])

  // Images drop area setup
  useEffect(() => {
    const dropArea = imagesDropAreaRef.current
    if (!dropArea) return

    const preventDefaults = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const highlight = () => {
      dropArea.classList.add('border-orange-500')
    }

    const unhighlight = () => {
      dropArea.classList.remove('border-orange-500')
    }

    const handleDrop = (e: DragEvent) => {
      preventDefaults(e)
      unhighlight()

      const dt = e.dataTransfer
      if (!dt) return

      const files = dt.files
      if (files.length) {
        const newFiles = Array.from(files)
        setImageFiles((prev) => [...prev, ...newFiles])

        // Create previews for new files
        Array.from(files).forEach((file) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            setImagePreviews((prev) => [...prev, reader.result as string])
          }
          reader.readAsDataURL(file)
        })
      }
    }

    // Event listeners
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false)
    })
    ;['dragenter', 'dragover'].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false)
    })
    ;['dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, unhighlight, false)
    })

    dropArea.addEventListener('drop', handleDrop as EventListener, false)

    // Cleanup function
    return () => {
      ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        dropArea.removeEventListener(eventName, preventDefaults, false)
      })
      ;['dragenter', 'dragover'].forEach((eventName) => {
        dropArea.removeEventListener(eventName, highlight, false)
      })
      ;['dragleave', 'drop'].forEach((eventName) => {
        dropArea.removeEventListener(eventName, unhighlight, false)
      })

      dropArea.removeEventListener('drop', handleDrop as EventListener, false)
    }
  }, [])

  return (
    <div className="space-y-4 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chỉnh sửa sản phẩm</h1>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Xóa
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-md border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="categoryName" className="text-sm font-medium">
                Danh mục <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.categoryName}
                onValueChange={(value) => handleSelectChange('categoryName', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Mô tả sản phẩm <span className="text-red-500">*</span>
              </Label>
              <RichTextEditor
                value={formData.description}
                onChange={handleDescriptionChange}
                className="mt-1"
              />
            </div>

            {/* Thumbnail Image Upload */}
            <div className="md:col-span-2">
              <Label htmlFor="thumbnailImage" className="text-sm font-medium">
                Hình ảnh đại diện <span className="text-red-500">*</span>
              </Label>
              <div
                ref={thumbnailDropAreaRef}
                className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-8 text-center transition-colors duration-200 cursor-pointer"
                onClick={() => thumbnailFileInputRef.current?.click()}
              >
                {thumbnailPreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={thumbnailPreview || '/placeholder.svg'}
                      alt="Thumbnail preview"
                      className="h-32 object-contain mb-2 rounded-md"
                    />
                    {thumbnailImageFile && (
                      <p className="text-sm text-gray-500">{thumbnailImageFile.name}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Kéo & Thả các tệp tin của bạn hoặc{' '}
                      <span className="text-orange-500 underline cursor-pointer">Tải lên</span>
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">
                      Kéo & Thả các tệp tin của bạn hoặc{' '}
                      <span className="text-orange-500 underline cursor-pointer">Tải lên</span>
                    </p>
                  </div>
                )}
                <input
                  ref={thumbnailFileInputRef}
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Multiple Images Upload */}
            <div className="md:col-span-2">
              <Label htmlFor="images" className="text-sm font-medium">
                Hình ảnh
              </Label>
              <div className="mt-1">
                {/* Existing Image Previews */}
                {existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Hình ảnh hiện tại:</p>
                    <div className="grid grid-cols-5 gap-4">
                      {existingImages.map((imageUrl, index) => (
                        <div key={`existing-${index}`} className="relative">
                          <img
                            src={imageUrl || '/placeholder.svg'}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-32 object-cover border rounded-md"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 hover:cursor-pointer"
                            onClick={() => removeExistingImage(index)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Hình ảnh mới:</p>
                    <div className="grid grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative">
                          <img
                            src={preview || '/placeholder.svg'}
                            alt={`New ${index + 1}`}
                            className="w-full h-32 object-cover border rounded-md"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            onClick={() => removeNewImage(index)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drop Area */}
                <div
                  ref={imagesDropAreaRef}
                  className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center transition-colors duration-200 cursor-pointer"
                  onClick={() => imagesFileInputRef.current?.click()}
                >
                  <p className="text-sm text-gray-500 mb-2">
                    Kéo & Thả các tệp tin của bạn hoặc{' '}
                    <span className="text-orange-500 underline cursor-pointer">Tải lên</span>
                  </p>
                  <input
                    ref={imagesFileInputRef}
                    id="images-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Information */}
        <div className="bg-white p-6 rounded-md border">
          <h2 className="text-lg font-medium mb-4">Giá sản phẩm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="originalPrice" className="text-sm font-medium">
                Giá nhập <span className="text-red-500">*</span>
              </Label>
              <Input
                id="originalPrice"
                name="originalPrice"
                type="number"
                min="0"
                value={formData.originalPrice === 0 ? '0' : formData.originalPrice || ''}
                onChange={handlePriceChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="sellingPrice" className="text-sm font-medium">
                Giá bán
              </Label>
              <Input
                id="sellingPrice"
                name="sellingPrice"
                type="number"
                min="0"
                value={formData.sellingPrice === 0 ? '0' : formData.sellingPrice || ''}
                onChange={handlePriceChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="discountPercentage" className="text-sm font-medium">
                Giảm giá (%)
              </Label>
              <Input
                id="discountPercentage"
                name="discountPercentage"
                type="number"
                min="0"
                max="100"
                value={formData.discountPercentage === 0 ? '0' : formData.discountPercentage || ''}
                onChange={handlePriceChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                Giá sau khi chiết khấu <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min="0"
                value={discountPrice}
                onChange={() => {}}
                className="mt-1"
                required
                disabled
              />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white p-6 rounded-md border">
          <h2 className="text-lg font-medium mb-4">Thông tin & Số lượng sản phẩm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="unit" className="text-sm font-medium">
                Đơn vị sản phẩm <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleSelectChange('unit', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn đơn vị" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KG">KG</SelectItem>
                  <SelectItem value="Hộp">Hộp</SelectItem>
                  <SelectItem value="Giỏ">Giỏ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="minUnitToOrder" className="text-sm font-medium">
                Điều kiện đặt hàng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="minUnitToOrder"
                name="minUnitToOrder"
                type="number"
                value={formData.minUnitToOrder === 1 ? '1' : formData.minUnitToOrder || ''}
                onChange={handleChange}
                min="1"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="stock" className="text-sm font-medium">
                Tình trạng hàng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock === 0 ? '0' : formData.stock || ''}
                onChange={handleChange}
                className="mt-1"
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="origin" className="text-sm font-medium">
                Xuất xứ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isLoading ? 'Đang xử lý...' : 'Lưu thay đổi'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
            Hủy bỏ
          </Button>
        </div>
      </form>
    </div>
  )
}

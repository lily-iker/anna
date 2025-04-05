'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useProductStore from '@/stores/useProductStore'
import useCategoryStore from '@/stores/useCategoryStore'
import toast from 'react-hot-toast'

export default function AddProductPage() {
  const navigate = useNavigate()
  const { addProduct, isLoading } = useProductStore()
  const { categories, fetchCategories } = useCategoryStore()
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
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropAreaRef = useRef<HTMLDivElement>(null)
  const [previewImage, setPreviewImage] = useState<string>('')

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let numValue = Number(value)

    // Ensure values are not negative
    if (numValue < 0) {
      numValue = 0
    }

    // Special handling for discount percentage (can't exceed 100%)
    if (name === 'discountPercentage' && numValue > 100) {
      numValue = 100
    }

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: numValue }
      const originalPrice = updatedFormData.originalPrice || 0

      // When discount percentage changes, update selling price
      if (name === 'discountPercentage') {
        const discount = numValue
        const sellingPrice = originalPrice * (1 - discount / 100)
        updatedFormData.sellingPrice = Number.parseFloat(sellingPrice.toFixed(2))
      }
      // When original price changes, update selling price based on current discount
      else if (name === 'originalPrice') {
        const discount = updatedFormData.discountPercentage
        const sellingPrice = numValue * (1 - discount / 100)
        updatedFormData.sellingPrice = Number.parseFloat(sellingPrice.toFixed(2))
      }
      // When selling price changes, update discount percentage
      else if (name === 'sellingPrice') {
        if (originalPrice > 0) {
          // Calculate discount percentage based on original and selling price
          const discount = ((originalPrice - numValue) / originalPrice) * 100
          // Ensure discount is between 0 and 100
          updatedFormData.discountPercentage = Number.parseFloat(
            Math.max(0, Math.min(100, discount)).toFixed(2)
          )
        } else {
          // If original price is 0, we can't calculate a discount
          updatedFormData.discountPercentage = 0
        }
      }

      return updatedFormData
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageFile) {
      toast.error('Vui lòng tải lên hình ảnh sản phẩm')
      return
    }

    // Create FormData object
    const productFormData = new FormData()

    // Add product data as JSON
    const productRequest = JSON.stringify(formData)
    productFormData.append('product', new Blob([productRequest], { type: 'application/json' }))

    // Add image file
    productFormData.append('imageFile', imageFile)

    const result = await addProduct(productFormData)
    if (result) {
      navigate('/admin/products')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    const dropArea = dropAreaRef.current
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
        setImageFile(file)

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewImage(reader.result as string)
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

  return (
    <div className="space-y-4 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Thêm sản phẩm mới</h1>
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
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="mt-1 h-30"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="thumbnailImage" className="text-sm font-medium">
                Hình ảnh <span className="text-red-500">*</span>
              </Label>
              <div
                ref={dropAreaRef}
                className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-8 text-center transition-colors duration-200 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewImage ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={previewImage || '/placeholder.svg'}
                      alt={formData.name}
                      className="h-32 object-contain mb-2"
                    />
                    <p className="text-sm text-gray-500">{imageFile?.name}</p>
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
                  ref={fileInputRef}
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
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
                Giá gốc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="originalPrice"
                name="originalPrice"
                type="number"
                min="0"
                value={formData.originalPrice || ''}
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
                value={formData.sellingPrice || ''}
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
                value={formData.discountPercentage || ''}
                onChange={handlePriceChange}
                className="mt-1"
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
                value={formData.minUnitToOrder || ''}
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
                value={formData.stock || ''}
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
            {isLoading ? 'Đang xử lý...' : 'Thêm sản phẩm'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
            Hủy bỏ
          </Button>
        </div>
      </form>
    </div>
  )
}

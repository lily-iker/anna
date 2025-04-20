'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import axios from '@/lib/axios-custom'
import { X, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface FeedbackFormProps {
  isOpen: boolean
  onClose: () => void
}

type FormState = 'form' | 'success' | 'error'

interface Product {
  id: string
  name: string
}

export function FeedbackForm({ isOpen, onClose }: FeedbackFormProps) {
  const [formState, setFormState] = useState<FormState>('form')
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhoneNumber: '',
    productName: '',
    content: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [timestamp, setTimestamp] = useState('')

  // Product search state
  const [productQuery, setProductQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [openProductSearch, setOpenProductSearch] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const fetchProducts = async (query: string) => {
    if (!query) {
      setProducts([])
      return
    }

    setIsLoadingProducts(true)
    try {
      const response = await axios.get('/api/product/search', {
        params: { name: query, page: 0, size: 5 },
      })

      setProducts(response.data.result.content || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const handleProductSearch = (value: string) => {
    setProductQuery(value)
    setFormData((prev) => ({ ...prev, productName: value }))

    // Always show dropdown when typing
    setOpenProductSearch(true)

    // Debounce API calls
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchProducts(value)
    }, 300)
  }

  // Select product from dropdown
  const handleSelectProduct = (product: Product) => {
    setFormData((prev) => ({ ...prev, productName: product.name }))
    setOpenProductSearch(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.customerPhoneNumber.trim() === '') {
      toast.error('Vui lòng nhập số điện thoại')
      return
    }

    if (!/^\d{10,11}$/.test(formData.customerPhoneNumber)) {
      toast.error('Số điện thoại không hợp lệ')
      return
    }

    if (formData.productName.trim() === '') {
      toast.error('Vui lòng nhập tên sản phẩm')
      return
    }

    if (formData.content.trim() === '') {
      toast.error('Vui lòng nhập nội dung góp ý')
      return
    }

    try {
      await axios.post('/api/feedback/create', formData)
      setTimestamp(new Date().toLocaleString('vi-VN'))
      setFormState('success')
    } catch (error) {
      setFormState('error')
    }
  }

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerPhoneNumber: '',
      productName: '',
      content: '',
    })
    setErrors({})
    setFormState('form')
    setProductQuery('')
    setProducts([])
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleTryAgain = () => {
    setFormState('form')
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Add this useEffect after the existing useEffect
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openProductSearch && !(event.target as Element).closest('.product-search-container')) {
        setOpenProductSearch(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openProductSearch])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {formState === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-medium text-green-600">
                Góp ý của bạn
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="customerName" className="text-sm font-medium">
                  Họ và tên
                </label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="customerPhoneNumber" className="text-sm font-medium">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <Input
                  id="customerPhoneNumber"
                  name="customerPhoneNumber"
                  value={formData.customerPhoneNumber}
                  onChange={handleChange}
                  className={cn('w-full', errors.customerPhoneNumber && 'border-red-500')}
                />
                {errors.customerPhoneNumber && (
                  <p className="text-xs text-red-500">{errors.customerPhoneNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="productName" className="text-sm font-medium">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <div className="relative product-search-container">
                  <Input
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={(e) => handleProductSearch(e.target.value)}
                    onFocus={() => setOpenProductSearch(true)}
                    className={cn('w-full', errors.productName && 'border-red-500')}
                  />
                  {isLoadingProducts && (
                    <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3 text-gray-400" />
                  )}

                  {openProductSearch && (
                    <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border">
                      <div className="p-2 text-sm text-gray-500 text-center">
                        {productQuery === ''
                          ? 'Vui lòng nhập tên sản phẩm'
                          : products.length === 0 && !isLoadingProducts
                          ? 'Không tìm thấy sản phẩm'
                          : ''}
                      </div>
                    </div>
                  )}

                  {openProductSearch && products.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border">
                      <div className="p-1">
                        {products.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-md"
                            onClick={() => {
                              handleSelectProduct(product)
                              setOpenProductSearch(false)
                            }}
                          >
                            <span>{product.name}</span>
                            {formData.productName === product.name && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {errors.productName && <p className="text-xs text-red-500">{errors.productName}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={5}
                  className={cn('w-full', errors.content && 'border-red-500')}
                />
                {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
              </div>

              <p className="text-xs text-red-500">
                Lưu ý: Các mục có dấu (*) là bắt buộc, vui lòng điền đầy đủ thông tin trước khi gửi
              </p>

              <div className="flex justify-center space-x-4 pt-4">
                <Button type="submit" className="bg-green-500 hover:bg-green-600 px-8">
                  Gửi ngay
                </Button>
                <Button type="button" variant="outline" onClick={handleClose} className="px-8">
                  Thoát
                </Button>
              </div>
            </form>
          </>
        )}

        {formState === 'success' && (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-green-500">
                  <svg
                    className="h-10 w-10 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="absolute -right-1 -top-1">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17317C0.00433284 8.00043 -0.193701 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8079C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7363 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268 0.761205C12.6136 0.258658 11.3132 0 10 0ZM14.375 8.125L9.375 13.125C9.27656 13.2234 9.1599 13.3016 9.03057 13.3548C8.90125 13.4079 8.76162 13.4351 8.62109 13.4351C8.48057 13.4351 8.34094 13.4079 8.21162 13.3548C8.08229 13.3016 7.96563 13.2234 7.86719 13.125L5.625 10.8828C5.52656 10.7844 5.4484 10.6677 5.39523 10.5384C5.34205 10.4091 5.31487 10.2694 5.31487 10.1289C5.31487 9.98838 5.34205 9.84875 5.39523 9.71943C5.4484 9.5901 5.52656 9.47344 5.625 9.375C5.72344 9.27656 5.8401 9.1984 5.96943 9.14523C6.09875 9.09205 6.23838 9.06487 6.37891 9.06487C6.51943 9.06487 6.65906 9.09205 6.78838 9.14523C6.91771 9.1984 7.03437 9.27656 7.13281 9.375L8.625 10.8672L12.8672 6.625C13.0656 6.42656 13.3359 6.31487 13.6172 6.31487C13.8984 6.31487 14.1687 6.42656 14.3672 6.625C14.5656 6.82344 14.6773 7.09375 14.6773 7.375C14.6773 7.65625 14.5656 7.92656 14.3672 8.125H14.375Z"
                      fill="#4CAF50"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="mb-4 text-xl font-bold text-green-600">GỬI PHẢN HỒI THÀNH CÔNG</h3>
            <p className="mb-6 px-4 text-sm text-gray-600">
              Cảm ơn bạn đã chia sẻ ý kiến. Mọi phản hồi đều có giá trị, giúp chúng tôi không ngừng
              cải thiện chất lượng sản phẩm và dịch vụ.
            </p>
            <p className="text-xs text-gray-500">Thời gian gửi: {timestamp}</p>
          </div>
        )}

        {formState === 'error' && (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white">
              <div className="h-16 w-16 rounded-full border-2 border-red-500 flex items-center justify-center">
                <svg
                  className="h-10 w-10 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-4 text-xl font-bold text-red-600">GỬI PHẢN HỒI THẤT BẠI</h3>
            <p className="mb-6 px-4 text-sm text-gray-600">
              Đã xảy ra lỗi khi gửi. Vui lòng thử lại sau.
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={handleTryAgain} className="bg-green-500 hover:bg-green-600 px-8">
                Thử lại
              </Button>
              <Button variant="outline" onClick={handleClose} className="px-8">
                Thoát
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

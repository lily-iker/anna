import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import useBlogStore from '@/stores/useBlogStore'
import toast from 'react-hot-toast'
import { RichTextEditor } from '@/components/ui/rich-text-editor'

export default function AddBlogPage() {
  const navigate = useNavigate()
  const { addBlog, isLoading } = useBlogStore()
  const [formData, setFormData] = useState({
    title: '',
    sapo: '',
    content: '',
    author: '',
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropAreaRef = useRef<HTMLDivElement>(null)
  const [previewImage, setPreviewImage] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleContentChange = (html: string) => {
    setFormData((prev) => ({
      ...prev,
      content: html,
    }))
  }

  const handleSummaryChange = (text: string) => {
    setFormData((prev) => ({
      ...prev,
      sapo: text,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.content.replace(/<[^>]*>/g, '').trim() === '') {
      toast.error('Vui lòng nhập nội dung cho bài viết')
      return
    }

    if (!imageFile) {
      toast.error('Vui lòng tải lên hình ảnh cho bài viết')
      return
    }

    // Create FormData object
    const blogFormData = new FormData()

    // Add blog data as JSON
    const blogRequest = JSON.stringify(formData)
    blogFormData.append('blog', new Blob([blogRequest], { type: 'application/json' }))

    // Add image file
    blogFormData.append('imageFile', imageFile)

    const result = await addBlog(blogFormData)
    if (result) {
      navigate('/admin/blogs')
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
        <h1 className="text-2xl font-bold">Thêm bài viết</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-md border">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Tiêu đề <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="sapo" className="text-sm font-medium">
                Tóm tắt blog (sapo) <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="sapo"
                name="sapo"
                value={formData.sapo}
                onChange={handleChange}
                rows={4}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-sm font-medium">
                Nội dung blog <span className="text-red-500">*</span>
              </Label>
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="author" className="text-sm font-medium">
                Tác giả <span className="text-red-500">*</span>
              </Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium">
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
                      src={previewImage}
                      alt="Blog preview"
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

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isLoading ? 'Đang xử lý...' : 'Thêm blog'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/blogs')}>
            Hủy bỏ
          </Button>
        </div>
      </form>
    </div>
  )
}

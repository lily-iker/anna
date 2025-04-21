import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import useBlogStore from '@/stores/useBlogStore'
import toast from 'react-hot-toast'

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { fetchBlogById, currentBlog, updateBlog, deleteBlogs, isLoading } = useBlogStore()

  const [formData, setFormData] = useState({
    title: '',
    sapo: '',
    content: '',
    author: '',
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (id) fetchBlogById(id)
  }, [id, fetchBlogById])

  useEffect(() => {
    if (currentBlog) {
      setFormData({
        title: currentBlog.title || '',
        sapo: currentBlog.sapo || '',
        content: currentBlog.content || '',
        author: currentBlog.author || '',
      })

      if (currentBlog.thumbnailImage) {
        setPreviewImage(currentBlog.thumbnailImage)
      }
    }
  }, [currentBlog])

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
    if (!id) return

    const blogFormData = new FormData()
    const blogRequest = JSON.stringify(formData)
    blogFormData.append('blog', new Blob([blogRequest], { type: 'application/json' }))

    if (formData.title.trim() === '') {
      toast.error('Vui lòng nhập tiêu đề cho bài viết')
      return
    }

    if (formData.sapo.trim() === '') {
      toast.error('Vui lòng nhập tóm tắt cho bài viết')
      return
    }

    if (formData.content.replace(/<[^>]*>/g, '').trim() === '') {
      toast.error('Vui lòng nhập nội dung cho bài viết')
      return
    }

    if (formData.author.trim() === '') {
      toast.error('Vui lòng nhập tên tác giả cho bài viết')
      return
    }

    if (imageFile) {
      blogFormData.append('imageFile', imageFile)
    }

    const result = await updateBlog(id, blogFormData)
    if (result) {
      navigate('/admin/blogs')
    }
  }

  const handleDelete = async () => {
    if (id && confirm('Bạn có chắc chắn muốn xóa blog này?')) {
      await deleteBlogs([id])
      navigate('/admin/blogs')
    }
  }

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

  return (
    <div className="space-y-4 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chỉnh sửa bài viết</h1>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Xóa
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-md border">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="title">
                Tiêu đề <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="sapo">
                Tóm tắt blog (sapo) <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="sapo"
                name="sapo"
                value={formData.sapo}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="content">
                Nội dung blog <span className="text-red-500">*</span>
              </Label>
              <RichTextEditor value={formData.content} onChange={handleContentChange} />
            </div>

            <div>
              <Label htmlFor="author">
                Tác giả <span className="text-red-500">*</span>
              </Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>
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
                      Kéo & Thả hoặc <span className="text-orange-500 underline">Tải lên</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Kéo & Thả hoặc <span className="text-orange-500 underline">Tải lên</span>
                  </p>
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

        <div className="flex space-x-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isLoading ? 'Đang xử lý...' : 'Lưu thay đổi'}
          </Button>
          <Button variant="outline" type="button" onClick={() => navigate('/admin/blogs')}>
            Hủy bỏ
          </Button>
        </div>
      </form>
    </div>
  )
}

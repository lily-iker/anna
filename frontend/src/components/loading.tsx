import { Loader2 } from 'lucide-react'

const Loading = () => {
  return (
    <div className="h-screen w-full bg-gray-300 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="size-16 text-green-500 animate-spin" />
        <span className="mt-2 text-xl text-gray-600">Đang tải...</span>
      </div>
    </div>
  )
}

export default Loading

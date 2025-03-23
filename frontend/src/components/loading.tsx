import { Loader2 } from 'lucide-react'

const Loading = () => {
  return (
    <div className='h-screen w-full bg-gray-300 flex items-center justify-center'>
        <Loader2 className='size-16 text-green-500 animate-spin' />
    </div>
  )
}

export default Loading
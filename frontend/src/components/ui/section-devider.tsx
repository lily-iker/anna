import { cn } from '@/lib/utils'

interface SectionDividerProps {
  className?: string
}

export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="h-px w-full bg-gray-200" />
    </div>
  )
}

import { cn } from "@/lib/utils"

interface SectionDividerProps {
  className?: string
}

export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </div>
  )
}
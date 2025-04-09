'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import useCartStore from '@/stores/useCartStore'
import { useEffect, useState } from 'react'
import CartContent from './card-content'

export default function CartIcon() {
  // Use state to handle hydration mismatch
  const [mounted, setMounted] = useState(false)
  const { getItemCount } = useCartStore()

  // Only show cart after hydration to prevent mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const itemCount = mounted ? getItemCount() : 0

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-green-600"
              aria-label={`${itemCount} items in cart`}
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <CartContent />
      </SheetContent>
    </Sheet>
  )
}

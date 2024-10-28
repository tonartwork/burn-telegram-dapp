import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface ContentWrapperProps {
  children: ReactNode
  className?: string
}

export function ContentWrapper({ children, className }: ContentWrapperProps) {
  return (
    <div className={cn(
      "container mx-auto px-4 py-12 bg-white text-mainText",
      className
    )}>
      {children}
    </div>
  )
}


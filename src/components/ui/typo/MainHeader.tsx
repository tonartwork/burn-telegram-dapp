import { cn } from "@/lib/utils"
import Link from "next/link"

interface MainHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function MainHeader({ children, className }: MainHeaderProps) {
  return (
    <Link href="/">
      <h1 className={cn(
        "text-5xl font-medium mb-4 text-center tracking-wide tracking-[1.4px] font-space-grotesk hover:opacity-80 transition-opacity",
        className
      )}>
        {children}
      </h1>
    </Link>
  );
}

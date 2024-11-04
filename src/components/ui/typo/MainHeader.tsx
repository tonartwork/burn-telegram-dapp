import { cn } from "@/lib/utils"

interface MainHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function MainHeader({ children, className }: MainHeaderProps) {
  return (
    <h1 className={cn(
      "text-5xl font-medium mb-4 text-center tracking-wide tracking-[1.4px] font-space-grotesk",
      className
    )}>
      {children}
    </h1>
  );
}

import { cn } from "@/lib/utils"

interface MainHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function MainHeader({ children, className }: MainHeaderProps) {
  return (
    <h1 className={cn(
      "text-5xl font-semibold mb-4 text-center tracking-wide tracking-[1.6px]",
      className
    )}>
      {children}
    </h1>
  );
}

import { cn } from "@/lib/utils"

interface MainHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function MainHeader({ children, className }: MainHeaderProps) {
  return (
    <h1 className={cn(
      "text-4xl font-bold mb-4 text-center tracking-wide",
      className
    )}>
      {children}
    </h1>
  );
}

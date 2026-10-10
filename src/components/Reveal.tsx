import { memo, type ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export const Reveal = memo(function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ ["--reveal-delay" as string]: `${Math.round(delay * 1000)}ms` }}
    >
      {children}
    </div>
  );
});

export default Reveal;

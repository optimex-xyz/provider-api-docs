import { cn } from "../lib/utils";

interface BlockProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}
export const Block = ({ children, className, ...props }: BlockProps) => {
  return (
    <div
      className={cn("bg-white/4 rounded-sm px-6 py-3", className)}
      {...props}
    >
      {children}
    </div>
  );
};

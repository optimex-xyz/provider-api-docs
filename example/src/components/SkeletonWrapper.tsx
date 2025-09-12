import { cn } from "../lib/utils";

import { Skeleton } from "./ui/skeleton";

interface SkeletonWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  customSkeleton?: React.ReactNode;
}
export const SkeletonWrapper = ({
  children,
  isLoading,
  className,
}: SkeletonWrapperProps) => {
  return isLoading ? (
    <Skeleton className={cn("w-12 h-6", className)} />
  ) : (
    children
  );
};

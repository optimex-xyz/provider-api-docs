interface LoadingProps {
  className?: string;
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ className, message }) => {
  return (
    <div className={`flex-1 w-full flex justify-center ${className || ""}`}>
      <div className="w-[32rem] mt-20 space-y-2">
        <div className="text-center text-white/60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p>{message || "Loading..."}</p>
        </div>
      </div>
    </div>
  );
};

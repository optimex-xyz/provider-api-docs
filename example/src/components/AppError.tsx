interface AppErrorProps {
  message: React.ReactNode;
}

export const AppError: React.FC<AppErrorProps> = ({ message }) => {
  return (
    <div className={`flex-1 w-full flex justify-center`}>
      <div className="w-[32rem] mt-20 space-y-2">
        <div className="text-center text-white/60">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

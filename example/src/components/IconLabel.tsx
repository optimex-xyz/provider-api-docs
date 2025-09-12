export const IconLabel = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-1 text-white/48 text-sm">
      {icon}
      {label}
    </div>
  );
};

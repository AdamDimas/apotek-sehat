export default function Input({ icon, className = "", ...props }) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
          {icon}
        </span>
      )}
      <input
        className={`w-full rounded-lg border border-line bg-surface py-2 text-[13px]
          placeholder:text-muted ${icon ? "pl-9 pr-3" : "px-3"} ${className}`}
        {...props}
      />
    </div>
  );
}

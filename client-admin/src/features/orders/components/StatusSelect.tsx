interface StatusSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function StatusSelect({ value, options, onChange, disabled }: StatusSelectProps) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-200 capitalize focus:border-brand-gold focus:outline-none disabled:opacity-60"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}

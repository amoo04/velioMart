import type { LucideIcon } from "lucide-react";

const colorMap = {
  green: "bg-emerald-500/15 text-emerald-400",
  blue: "bg-sky-500/15 text-sky-400",
  amber: "bg-amber-500/15 text-amber-400",
  purple: "bg-violet-500/15 text-violet-400",
  red: "bg-red-500/15 text-red-400",
} as const;

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: keyof typeof colorMap;
}

export default function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="rounded-xl bg-brand-black-soft p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${colorMap[color]}`}>
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

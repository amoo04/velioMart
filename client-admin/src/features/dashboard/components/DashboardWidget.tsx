import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface DashboardWidgetProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
}

export default function DashboardWidget({ title, icon: Icon, children }: DashboardWidgetProps) {
  return (
    <section className="rounded-xl bg-brand-black-soft p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif-brand text-base font-semibold text-white">{title}</h2>
        {Icon && <Icon className="h-4 w-4 text-brand-gold" strokeWidth={1.75} />}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

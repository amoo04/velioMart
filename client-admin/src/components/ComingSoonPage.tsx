import { Construction } from "lucide-react";

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif-brand text-2xl font-semibold text-brand-black">{title}</h1>
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-24">
        <Construction className="h-10 w-10 text-brand-gold" strokeWidth={1.5} />
        <p className="text-sm text-gray-500">This section is coming soon.</p>
      </div>
    </div>
  );
}

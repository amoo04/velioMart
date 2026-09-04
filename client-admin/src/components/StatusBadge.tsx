const colorMap: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-amber-100 text-amber-700",
  success: "bg-green-100 text-green-700",
  delivered: "bg-green-100 text-green-700",
  active: "bg-green-100 text-green-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  shipped: "bg-blue-100 text-blue-700",
  out_for_delivery: "bg-blue-100 text-blue-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
  inactive: "bg-gray-100 text-gray-600",
};

export default function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  const classes = colorMap[key] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${classes}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  variant?: "light" | "dark";
  maxWidth?: string;
}

export default function Modal({ title, onClose, children, variant = "light", maxWidth = "max-w-lg" }: ModalProps) {
  const isDark = variant === "dark";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        style={isDark ? { colorScheme: "dark" } : undefined}
        className={`w-full ${maxWidth} rounded-xl border-t-4 border-brand-gold p-6 shadow-2xl ${
          isDark ? "bg-brand-black" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <h2
            className={`font-serif-brand text-lg font-semibold ${isDark ? "text-white" : "text-brand-black"}`}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className={`rounded-lg px-2 py-1 ${
              isDark
                ? "text-gray-500 hover:bg-white/5 hover:text-gray-300"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            }`}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

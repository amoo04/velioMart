import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../lib/auth-context";

export default function TopBar() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-14 shrink-0 items-center justify-end border-b border-white/10 bg-brand-black px-6">
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gold/20 text-xs font-semibold text-brand-gold">
            {initial}
          </div>
          <span className="text-sm font-medium text-gray-200">{user?.name}</span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
        </button>

        {open && (
          <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-white/10 bg-brand-black-soft py-1 shadow-lg">
            <p className="truncate border-b border-white/10 px-3 py-2 text-xs text-gray-500">
              {user?.email}
            </p>
            <button
              onClick={signOut}
              className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";

interface SearchBarProps {
  placeholder: string;
  onSearch: (value: string) => void;
}

export default function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-white/10 bg-brand-black-soft py-2 pr-3 pl-9 text-sm text-white placeholder-gray-500 focus:border-brand-gold focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-brand-gold px-5 py-2 text-sm font-medium text-brand-black hover:bg-brand-gold-soft"
      >
        Search
      </button>
    </form>
  );
}

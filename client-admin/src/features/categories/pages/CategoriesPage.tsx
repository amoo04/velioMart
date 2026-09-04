import { useMemo, useState } from "react";
import { Folder, Pencil, Trash2 } from "lucide-react";
import { useCategoriesQuery, useDeleteCategory } from "../hooks/useCategories";
import { useProductsQuery } from "../../products/hooks/useProducts";
import CategoryFormModal from "../components/CategoryFormModal";
import SearchBar from "../../../components/SearchBar";
import type { Category } from "../api/categories.api";

type ViewMode = "tree" | "list";

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategoriesQuery();
  const { data: products = [] } = useProductsQuery();
  const deleteCategory = useDeleteCategory();
  const [editing, setEditing] = useState<Category | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [view, setView] = useState<ViewMode>("tree");
  const [search, setSearch] = useState("");

  const productCount = useMemo(() => {
    const counts = new Map<number, number>();
    for (const product of products) {
      if (product.category_id == null) continue;
      counts.set(product.category_id, (counts.get(product.category_id) ?? 0) + 1);
    }
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  const roots = filtered.filter((c) => c.parentId == null);
  const childrenOf = (parentId: number) => filtered.filter((c) => c.parentId === parentId);

  const handleDelete = (category: Category) => {
    if (confirm(`Delete "${category.name}"? This cannot be undone.`)) {
      deleteCategory.mutate(category.id);
    }
  };

  const CategoryRow = ({ category, indent = false }: { category: Category; indent?: boolean }) => (
    <div
      key={category.id}
      className={`group flex items-center justify-between px-5 py-3 ${indent ? "pl-12" : ""}`}
    >
      <button
        onClick={() => setEditing(category)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <Folder className="h-4 w-4 shrink-0 text-brand-gold" strokeWidth={1.75} />
        <span className="truncate text-sm font-medium text-white uppercase">{category.name}</span>
      </button>
      <div className="flex shrink-0 items-center gap-4">
        <span className="text-sm text-gray-400">
          {productCount.get(category.id) ?? 0} products
        </span>
        <button
          onClick={() => setEditing(category)}
          className="text-gray-500 opacity-0 hover:text-brand-gold group-hover:opacity-100"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
        <button
          onClick={() => handleDelete(category)}
          className="text-gray-500 opacity-0 hover:text-red-400 group-hover:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif-brand text-2xl font-semibold text-brand-black">Categories</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-black hover:bg-brand-gold-soft"
        >
          + New Category
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar placeholder="Search categories..." onSearch={setSearch} />
        <div className="flex shrink-0 overflow-hidden rounded-lg border border-white/10">
          <button
            onClick={() => setView("tree")}
            className={`px-4 py-2 text-sm font-medium ${
              view === "tree" ? "bg-brand-black text-white" : "bg-brand-black-soft text-gray-400"
            }`}
          >
            Tree View
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 text-sm font-medium ${
              view === "list" ? "bg-brand-black text-white" : "bg-brand-black-soft text-gray-400"
            }`}
          >
            List View
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-brand-black-soft">
        {isLoading ? (
          <p className="p-6 text-sm text-gray-400">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No categories found.</p>
        ) : view === "tree" ? (
          <div className="divide-y divide-white/10">
            {roots.map((root) => (
              <div key={root.id}>
                <CategoryRow category={root} />
                {childrenOf(root.id).map((child) => (
                  <CategoryRow key={child.id} category={child} indent />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Slug</th>
                <th className="px-5 py-3 font-medium">Products</th>
                <th className="px-5 py-3 font-medium">Sort</th>
                <th className="px-5 py-3 font-medium">Active</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map((category) => (
                <tr key={category.id}>
                  <td className="px-5 py-3 font-medium text-white uppercase">{category.name}</td>
                  <td className="px-5 py-3 text-gray-400">{category.slug}</td>
                  <td className="px-5 py-3 text-gray-200">{productCount.get(category.id) ?? 0}</td>
                  <td className="px-5 py-3 text-gray-200">{category.sortOrder}</td>
                  <td className="px-5 py-3 text-gray-200">{category.isActive ? "Yes" : "No"}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditing(category)}
                        className="flex items-center gap-1.5 text-brand-gold hover:text-brand-gold-soft"
                      >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showCreate && <CategoryFormModal onClose={() => setShowCreate(false)} />}
      {editing && <CategoryFormModal category={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

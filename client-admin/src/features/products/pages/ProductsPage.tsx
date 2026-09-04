import { useState } from "react";
import { Pencil } from "lucide-react";
import { useProductsQuery, useDeleteProduct } from "../hooks/useProducts";
import { useCategoriesQuery } from "../../categories/hooks/useCategories";
import ProductFormModal from "../components/ProductFormModal";
import SearchBar from "../../../components/SearchBar";
import { formatMoney } from "../../../lib/format";
import { resolveMediaUrl } from "../../../lib/api";
import type { Product } from "../api/products.api";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const { data: products = [], isLoading } = useProductsQuery(search || undefined);
  const { data: categories = [] } = useCategoriesQuery();
  const deleteProduct = useDeleteProduct();
  const [editing, setEditing] = useState<Product | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const categoryName = (categoryId: number | null) =>
    categories.find((c) => c.id === categoryId)?.name.toLowerCase() ?? "—";

  const toggleAll = () => {
    setSelected(selected.size === products.length ? new Set() : new Set(products.map((p) => p.id)));
  };

  const toggleOne = (id: number) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selected.size} selected product${selected.size === 1 ? "" : "s"}?`)) {
      selected.forEach((id) => deleteProduct.mutate(id));
      setSelected(new Set());
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif-brand text-2xl font-semibold text-brand-black">Products</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-black hover:bg-brand-gold-soft"
        >
          + New Product
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar placeholder="Search products..." onSearch={setSearch} />
        {selected.size > 0 && (
          <button
            onClick={handleBulkDelete}
            className="shrink-0 rounded-lg bg-red-500/15 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/25"
          >
            Delete {selected.size} selected
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl bg-brand-black-soft">
        {isLoading ? (
          <p className="p-6 text-sm text-gray-400">Loading...</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No products found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="w-10 px-5 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === products.length && products.length > 0}
                    onChange={toggleAll}
                    className="accent-brand-gold"
                  />
                </th>
                <th className="px-2 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(product.id)}
                      onChange={() => toggleOne(product.id)}
                      className="accent-brand-gold"
                    />
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img
                          src={resolveMediaUrl(product.image_url)}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-white/10" />
                      )}
                      <span className="font-medium text-white uppercase">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-200">₦{formatMoney(product.price)}</td>
                  <td className={`px-5 py-3 ${product.stock <= 5 ? "text-amber-400" : "text-gray-200"}`}>
                    {product.stock}
                  </td>
                  <td className="px-5 py-3 text-gray-400">{categoryName(product.category_id)}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setEditing(product)}
                      className="flex items-center gap-1.5 text-brand-gold hover:text-brand-gold-soft"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showCreate && <ProductFormModal onClose={() => setShowCreate(false)} />}
      {editing && <ProductFormModal product={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

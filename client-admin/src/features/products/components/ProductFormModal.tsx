import { useState, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import { useCreateProduct, useUpdateProduct } from "../hooks/useProducts";
import { useCategoriesQuery } from "../../categories/hooks/useCategories";
import ImagePicker from "../../media/components/ImagePicker";
import { dollarsToCents } from "../../../lib/format";
import type { Product } from "../api/products.api";

interface ProductFormModalProps {
  product?: Product;
  onClose: () => void;
}

export default function ProductFormModal({ product, onClose }: ProductFormModalProps) {
  const { data: categories = [] } = useCategoriesQuery();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price / 100) : "");
  const [stock, setStock] = useState(product ? String(product.stock) : "0");
  const [categoryId, setCategoryId] = useState(product?.category_id ? String(product.category_id) : "");
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [status, setStatus] = useState(product?.status ?? "active");
  const [error, setError] = useState<string | null>(null);

  const isPending = createProduct.isPending || updateProduct.isPending;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const data = {
      name,
      description: description || null,
      price: dollarsToCents(Number(price)),
      stock: Number(stock),
      category_id: categoryId ? Number(categoryId) : null,
      image_url: imageUrl || null,
      brand: brand || null,
      status,
    };

    try {
      if (product) {
        await updateProduct.mutateAsync({ id: product.id, data });
      } else {
        await createProduct.mutateAsync(data);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const inputClass =
    "rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 transition-colors focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold";
  const selectClass = `${inputClass} [color-scheme:dark]`;

  return (
    <Modal title={product ? "Edit Product" : "New Product"} onClose={onClose} variant="dark" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Name</label>
          <input
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Description</label>
          <textarea
            value={description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Price (₦)</label>
            <div className="flex items-center rounded-lg border border-white/10 bg-white/5 pl-3 transition-colors focus-within:border-brand-gold focus-within:ring-1 focus-within:ring-brand-gold">
              <span className="text-sm text-gray-500">₦</span>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg border-none bg-transparent px-2 py-2.5 text-sm text-white outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Stock</label>
            <input
              required
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={selectClass}
            >
              <option value="">None</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Brand</label>
          <input value={brand ?? ""} onChange={(e) => setBrand(e.target.value)} className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Image</label>
          <ImagePicker value={imageUrl || null} onChange={(url) => setImageUrl(url ?? "")} />
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
        )}

        <div className="mt-1 flex justify-end gap-2 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-black hover:bg-brand-gold-soft disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

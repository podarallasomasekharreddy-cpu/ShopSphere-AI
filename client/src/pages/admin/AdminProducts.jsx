import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Search,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

const GOLD = "#D4AF37";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
const [editingProduct, setEditingProduct] = useState(null);

const emptyProduct = {
  title: "",
  brand: "",
  category: "",
  collection: "",
  badge: "",
  price: "",
  oldPrice: "",
  rating: "",
  reviews: "",
  stock: "",
  inStock: true,
  description: "",
  image: "",
  images: [],
  colors: [],
  sizes: [],
  features: [],
  specifications: {},
};

const [formData, setFormData] = useState(emptyProduct);
const [imageFiles, setImageFiles] = useState([]);

const uploadImages = async () => {
  if (imageFiles.length === 0) {
    return [];
  }

  const token = localStorage.getItem("token");

  const data = new FormData();

  imageFiles.forEach((file) => {
    data.append("images", file);
  });

  const response = await fetch(
    "http://localhost:5001/api/admin/upload-images",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to upload images");
  }

  return result.images;
};

const saveProduct = async () => {
  try {
    setError("");

    const token = localStorage.getItem("token");

    const uploadedImages = await uploadImages();

    const productPayload = {
      ...formData,
      image: uploadedImages[0] || formData.image || null,
      images: uploadedImages,
    };

    const url = editingProduct
      ? `http://localhost:5001/api/admin/products/${editingProduct.id}`
      : "http://localhost:5001/api/admin/products";

    const response = await fetch(url, {
      method: editingProduct ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          (editingProduct
            ? "Failed to update product"
            : "Failed to create product")
      );
    }

    setShowForm(false);
    setEditingProduct(null);
    setFormData(emptyProduct);
    setImageFiles([]);

    await loadProducts();
  } catch (err) {
    console.error("Save product error:", err);
    setError(err.message);
  }
};

const openAddForm = () => {
  setEditingProduct(null);
  setFormData(emptyProduct);
  setImageFiles([]);
  setShowForm(true);
};

const openEditForm = (product) => {
  setEditingProduct(product);

  setFormData({
    ...emptyProduct,
    ...product,
    oldPrice: product.old_price ?? product.oldPrice ?? "",
    inStock:
      product.in_stock !== undefined
        ? Boolean(product.in_stock)
        : product.inStock !== undefined
        ? Boolean(product.inStock)
        : Number(product.stock) > 0,
  });

  setShowForm(true);
};

 
const loadProducts = async () => {
  try {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    // Import/update DummyJSON products in MySQL first
    const importResponse = await fetch(
      "http://localhost:5001/api/admin/import-dummyjson",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const importData = await importResponse.json();

    if (!importResponse.ok) {
      throw new Error(
        importData.message || "Failed to import DummyJSON products"
      );
    }

    // Load all products: existing products + imported products
    const response = await fetch(
      "http://localhost:5001/api/products"
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to load products"
      );
    }

    setProducts(data);
  } catch (err) {
    console.error("Admin products error:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) =>
      [
        product.title,
        product.brand,
        product.category,
        product.collection,
        product.slug,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [products, search]);

  return (
    <main className="min-h-screen bg-[#050505] px-6 pb-20 pt-28 text-white">
      {showForm && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-md">
    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl">
      
      {/* FORM HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: GOLD }}
          >
            ShopSpher Administration
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/20 hover:text-white"
        >
          ×
        </button>
      </div>

      {/* FORM */}
      <div className="grid gap-5 md:grid-cols-2">

        {/* TITLE */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Product Title *
          </label>

          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
            placeholder="Enter product title"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-[#D4AF37]/60"
          />
        </div>

        {/* BRAND */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Brand *
          </label>

          <input
            type="text"
            value={formData.brand}
            onChange={(e) =>
              setFormData({
                ...formData,
                brand: e.target.value,
              })
            }
            placeholder="e.g. Rolex"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-[#D4AF37]/60"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Category *
          </label>

          <input
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value,
              })
            }
            placeholder="e.g. Watches"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-[#D4AF37]/60"
          />
        </div>

        {/* COLLECTION */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Collection
          </label>

          <input
            type="text"
            value={formData.collection}
            onChange={(e) =>
              setFormData({
                ...formData,
                collection: e.target.value,
              })
            }
            placeholder="Collection name"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-[#D4AF37]/60"
          />
        </div>

        {/* BADGE */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Badge
          </label>

          <input
            type="text"
            value={formData.badge}
            onChange={(e) =>
              setFormData({
                ...formData,
                badge: e.target.value,
              })
            }
            placeholder="e.g. New, Bestseller"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-[#D4AF37]/60"
          />
        </div>

        {/* PRICE */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Price *
          </label>

          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: e.target.value,
              })
            }
            placeholder="0"
            min="0"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-[#D4AF37]/60"
          />
        </div>

        {/* OLD PRICE */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Old Price
          </label>

          <input
            type="number"
            value={formData.oldPrice}
            onChange={(e) =>
              setFormData({
                ...formData,
                oldPrice: e.target.value,
              })
            }
            placeholder="0"
            min="0"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-[#D4AF37]/60"
          />
        </div>

        {/* STOCK */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Stock *
          </label>

          <input
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData({
                ...formData,
                stock: e.target.value,
              })
            }
            placeholder="0"
            min="0"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-[#D4AF37]/60"
          />
        </div>

        {/* RATING */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Rating
          </label>

          <input
            type="number"
            value={formData.rating}
            onChange={(e) =>
              setFormData({
                ...formData,
                rating: e.target.value,
              })
            }
            placeholder="0 - 5"
            min="0"
            max="5"
            step="0.1"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-[#D4AF37]/60"
          />
        </div>

        {/* REVIEWS */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Reviews
          </label>

          <input
            type="number"
            value={formData.reviews}
            onChange={(e) =>
              setFormData({
                ...formData,
                reviews: e.target.value,
              })
            }
            placeholder="0"
            min="0"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-[#D4AF37]/60"
          />
        </div>

       {/* PRODUCT IMAGES */}
<div className="md:col-span-2">
  <label className="mb-2 block text-sm font-semibold text-zinc-300">
    Product Images
  </label>

  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-8 text-center transition hover:border-[#D4AF37]/60 hover:bg-white/10">
    <Plus size={28} style={{ color: GOLD }} />

    <p className="mt-3 font-semibold text-white">
      Upload Product Images
    </p>

    <p className="mt-1 text-sm text-zinc-500">
      Select one or multiple images from your computer
    </p>

    <input
      type="file"
      accept="image/*"
      multiple
      className="hidden"
      onChange={(e) => {
        const files = Array.from(e.target.files || []);
        setImageFiles(files);
      }}
    />
  </label>

  {imageFiles.length > 0 && (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {imageFiles.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
        >
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="h-32 w-full object-cover"
          />

          <p className="truncate px-3 py-2 text-xs text-zinc-400">
            {file.name}
          </p>
        </div>
      ))}
    </div>
  )}
</div>

        {/* DESCRIPTION */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Description
          </label>

          <textarea
            rows="5"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            placeholder="Describe the product..."
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-[#D4AF37]/60"
          />
        </div>

        {/* IN STOCK */}
        <div className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={formData.inStock}
            onChange={(e) =>
              setFormData({
                ...formData,
                inStock: e.target.checked,
              })
            }
            className="h-5 w-5 accent-[#D4AF37]"
          />

          <label className="text-sm text-zinc-300">
            Product is available for purchase
          </label>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={saveProduct}
          className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#b58d15] px-7 py-3 font-bold text-black transition hover:scale-105"
        >
          {editingProduct ? "Update Product" : "Create Product"}
        </button>
      </div>
    </div>
  </div>
)}
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-[0.3em]"
              style={{ color: GOLD }}
            >
              ShopSpher Administration
            </p>

            <h1 className="mt-3 text-4xl font-black md:text-5xl">
              Product Management
            </h1>

            <p className="mt-3 max-w-2xl text-zinc-400">
              Manage your ShopSpher products, prices,
              stock, and product information.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#b58d15] px-6 py-3 font-bold text-black transition hover:scale-105"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* SEARCH + REFRESH */}
        <div className="mb-7 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              type="text"
              placeholder="Search products by name, brand, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-5 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#D4AF37]/60"
            />
          </div>

          <button
            type="button"
            onClick={loadProducts}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-zinc-300 transition hover:border-[#D4AF37]/50 hover:text-white"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* SUMMARY */}
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
            <Package size={22} color={GOLD} />
          </div>

          <div>
            <p className="text-sm text-zinc-500">
              Products
            </p>

            <p className="text-xl font-black">
              {filteredProducts.length}
            </p>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-zinc-400">
              Loading products...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <p className="text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={loadProducts}
              className="mt-5 rounded-full bg-[#D4AF37] px-5 py-2 font-bold text-black"
            >
              Try Again
            </button>
          </div>
        )}

        {/* PRODUCTS */}
        {!loading && !error && (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">

            {/* TABLE HEADER */}
            <div className="hidden grid-cols-[80px_1.5fr_1fr_1fr_120px_120px_130px] gap-4 border-b border-white/10 bg-[#111111] px-6 py-5 text-xs font-semibold uppercase tracking-wider text-zinc-500 lg:grid">
              <div>ID</div>
              <div>Product</div>
              <div>Brand</div>
              <div>Category</div>
              <div>Price</div>
              <div>Stock</div>
              <div>Actions</div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center">
                <Package
                  size={40}
                  className="mx-auto text-zinc-600"
                />

                <p className="mt-4 text-zinc-400">
                  No products found.
                </p>
              </div>
            ) : (
              <div>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border-b border-white/10 px-6 py-6 last:border-b-0"
                  >
                    <div className="grid gap-5 lg:grid-cols-[80px_1.5fr_1fr_1fr_120px_120px_130px] lg:items-center">

                      {/* ID */}
                      <div>
                        <p className="text-xs text-zinc-500 lg:hidden">
                          ID
                        </p>

                        <p className="font-semibold text-zinc-300">
                          #{product.id}
                        </p>
                      </div>

                      {/* PRODUCT */}
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#111111]">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package
                                size={22}
                                color={GOLD}
                              />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-white">
                            {product.title}
                          </p>

                          <p className="mt-1 truncate text-xs text-zinc-500">
                            {product.slug}
                          </p>
                        </div>
                      </div>

                      {/* BRAND */}
                      <div>
                        <p className="text-xs text-zinc-500 lg:hidden">
                          Brand
                        </p>

                        <p className="text-sm text-zinc-300">
                          {product.brand || "—"}
                        </p>
                      </div>

                      {/* CATEGORY */}
                      <div>
                        <p className="text-xs text-zinc-500 lg:hidden">
                          Category
                        </p>

                        <p className="text-sm text-zinc-300">
                          {product.category || "—"}
                        </p>
                      </div>

                      {/* PRICE */}
                      <div>
                        <p className="text-xs text-zinc-500 lg:hidden">
                          Price
                        </p>

                        <p className="font-bold text-white">
                          {currency.format(
                            Number(product.price || 0)
                          )}
                        </p>
                      </div>

                      {/* STOCK */}
                      <div>
                        <p className="text-xs text-zinc-500 lg:hidden">
                          Stock
                        </p>

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            Number(product.stock) > 0
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {Number(product.stock) > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </span>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(product)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                          title="Edit product"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
  type="button"
  onClick={async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.title}"?`
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5001/api/admin/products/${product.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      setProducts((currentProducts) =>
        currentProducts.filter((item) => item.id !== product.id)
      );
    } catch (err) {
      console.error("Delete product error:", err);
      setError(err.message);
    }
  }}
  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:border-red-500/50 hover:text-red-400"
  title="Delete product"
>
  <Trash2 size={17} />
</button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}
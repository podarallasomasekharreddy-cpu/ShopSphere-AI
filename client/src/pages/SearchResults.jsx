
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

import ProductCard from "../components/shop/ProductCard";
import allProducts from "../data/products";

const API_BASE = "https://shopsphere-ai-zwey.onrender.com";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch(`${API_BASE}/api/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (!cancelled && Array.isArray(data)) {
          setDbProducts(data);
        }
      } catch (error) {
        console.error("Search results database products:", error);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) return [];

    const combined = [...dbProducts, ...allProducts];
    const seen = new Set();

    return combined.filter((product) => {
      const title = String(product.title || product.name || "");
      const brand = String(product.brand || "");
      const category = String(product.category || "");
      const collection = String(product.collection || "");
      const description = String(product.description || "");

      const matches = [
        title,
        brand,
        category,
        collection,
        description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);

      const key = `${title.toLowerCase()}|${brand.toLowerCase()}|${String(product.price ?? "")}`;

      if (!matches || seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  }, [query, dbProducts]);

  return (
    <main className="min-h-screen bg-[#050505] px-6 pb-20 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12">
          <div className="flex items-center gap-3 text-[#D4AF37]">
            <Search size={22} />
            <span className="text-sm font-semibold uppercase tracking-[0.3em]">
              Search Results
            </span>
          </div>

          <h1 className="mt-5 break-words text-4xl font-black lg:text-5xl">
            Results for{" "}
            <span className="text-[#D4AF37]">"{query}"</span>
          </h1>

          <p className="mt-4 text-zinc-400">
            {results.length} products found
          </p>
        </div>

        {results.length === 0 ? (
          <div className="rounded-[30px] border border-white/10 bg-[#111111] px-6 py-24 text-center">
            <Search size={45} className="mx-auto text-[#D4AF37]" />

            <h2 className="mt-6 text-3xl font-bold">No Products Found</h2>

            <p className="mt-4 text-zinc-500">
              Try searching for another product, brand or category.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {results.map((product, index) => (
              <ProductCard
                key={`${product.id}-${product.title || product.name}-${index}`}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

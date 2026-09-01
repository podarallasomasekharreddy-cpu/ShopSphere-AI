import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

import ProductCard from "../components/shop/ProductCard";
import allProducts from "../data/products";

export default function SearchResults() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") || "";

  const results = useMemo(() => {
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
      return [];
    }

    return allProducts.filter((product) =>
      `${product.title} ${product.brand} ${product.category}`
        .toLowerCase()
        .includes(searchTerm)
    );
  }, [query]);

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

          <h1 className="mt-5 text-4xl font-black lg:text-5xl">
            Results for{" "}
            <span className="text-[#D4AF37]">
              "{query}"
            </span>
          </h1>

          <p className="mt-4 text-zinc-400">
            {results.length} products found
          </p>
        </div>

        {results.length === 0 ? (
          <div className="rounded-[30px] border border-white/10 bg-[#111111] px-6 py-24 text-center">
            <Search
              size={45}
              className="mx-auto text-[#D4AF37]"
            />

            <h2 className="mt-6 text-3xl font-bold">
              No Products Found
            </h2>

            <p className="mt-4 text-zinc-500">
              Try searching for another product, brand or category.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
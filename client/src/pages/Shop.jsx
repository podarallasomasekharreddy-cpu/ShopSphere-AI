import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import ShopHero from "../components/shop/ShopHero";
import Filters from "../components/shop/Filters";
import ActiveFilters from "../components/shop/ActiveFilters";
import ProductGrid from "../components/shop/ProductGrid";

export default function Shop() {
  const [searchParams] = useSearchParams();
const collection = searchParams.get("collection");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [price, setPrice] = useState(500000);
  const [rating, setRating] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState(
  searchParams.get("sort") || "featured"
);
  const [search, setSearch] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(collection || "All");

  const resetFilters = () => {
setSelectedCategory("All");
setSelectedBrand("All");
setSelectedCollection("All");
setPrice(500000);
setRating(0);
setInStock(false);
setSort("featured");
};

  return (
  <main className="min-h-screen bg-[#050505]">
    <ShopHero />

    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Luxury Collection
          </h2>

          <p className="mt-2 text-zinc-400">
            Discover premium fashion curated for modern lifestyle.
          </p>
        </div>

        <Filters
          sort={sort}
          setSort={setSort}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          price={price}
          setPrice={setPrice}
          rating={rating}
          setRating={setRating}
          inStock={inStock}
          setInStock={setInStock}
          resetFilters={resetFilters}
        />
      </div>

      <ActiveFilters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        rating={rating}
        setRating={setRating}
        inStock={inStock}
        setInStock={setInStock}
        resetFilters={resetFilters}
      />

      <div className="mt-8">
        <ProductGrid
selectedCategory={selectedCategory}
selectedBrand={selectedBrand}
selectedCollection={selectedCollection}
price={price}
rating={rating}
inStock={inStock}
sort={sort}
search={search}
/>
      </div>
    </section>
  </main>
);
}


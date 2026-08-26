"use client";
import { getPaginatedProducts, getCategories } from "@/api/products";
import { useEffect, useState, useCallback } from "react";
import Product from "@/types/productInterface";
import ProductCard from "./ProductCard";
import Category from "@/types/categoryInterface";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TagsIcon,
  FilterMailIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

const PAGE_SIZE = 3;

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const fetchProducts = useCallback(async (pageNum: number, category: string) => {
    setLoading(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await (getPaginatedProducts as any)({
        page: pageNum,
        pageSize: PAGE_SIZE,
        category,
      });
      setProducts(data.results ?? []);
      setCount(data.count ?? 0);
      setNext(data.next ?? null);
      setPrevious(data.previous ?? null);
    } catch {
      setError("Could not load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial categories load
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);

  // Fetch paginated products whenever page or category changes
  useEffect(() => {
    fetchProducts(page, activeCategory);
  }, [page, activeCategory, fetchProducts]);

  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
    setPage(1);
  };

  const handlePrevious = () => {
    if (page > 1 && !loading) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (next && !loading) setPage((p) => p + 1);
  };

  return (
    <section className="w-screen min-h-screen" id="shop">
      <div className="cont w-full h-full flex flex-col gap-8 pt-10">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-5">
          All products
        </h2>
        <div className="w-full flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/4 h-fit border p-3 bg-primary-foreground ">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-5">
              <HugeiconsIcon icon={FilterMailIcon} />
              Categories
            </h3>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
              <div
                onClick={() => handleCategoryChange("all")}
                className={`flex items-center gap-2 border p-2 hover:bg-foreground/10 hover:text-primary cursor-pointer text-sm whitespace-nowrap ${activeCategory === "all" ? "bg-foreground text-primary-foreground" : ""}`}
              >
                <HugeiconsIcon icon={TagsIcon} size={17} />
                <span>All</span>
              </div>
              {categories &&
                categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`flex items-center gap-2 border p-2 hover:bg-foreground/10 hover:text-primary cursor-pointer text-sm whitespace-nowrap ${activeCategory === category.name ? "bg-foreground text-primary-foreground" : ""}`}
                  >
                    <HugeiconsIcon icon={TagsIcon} size={17} />
                    <span>{category.name}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="w-full lg:w-3/4 flex flex-col gap-6">
            {error && (
              <p className="text-sm text-destructive border border-destructive/30 p-3 bg-primary-foreground">
                {error}
              </p>
            )}

            {loading ? (
              <p className="text-sm text-foreground/60">Loading products…</p>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 border bg-primary-foreground">
                <p className="text-foreground/70">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t">
              <button
                onClick={handlePrevious}
                disabled={page <= 1 || loading || !previous}
                className="inline-flex items-center gap-2 border px-4 py-2 text-sm bg-primary-foreground hover:bg-foreground/5 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                Previous
              </button>

              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-medium">
                  Page {page} of {totalPages}
                </span>
                <span className="text-xs text-foreground/60">
                  {count} {count === 1 ? "product" : "products"}
                  {activeCategory !== "all" ? ` in ${activeCategory}` : ""}
                </span>
              </div>

              <button
                onClick={handleNext}
                disabled={!next || loading}
                className="inline-flex items-center gap-2 border px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                Next
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;

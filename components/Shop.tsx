"use client";
import { getProducts, getCategories } from "@/api/products";
import { useEffect, useState } from "react";
import Product from "@/types/productInterface";
import ProductCard from "./ProductCard";
import Category from "@/types/categoryInterface";
import { HugeiconsIcon } from "@hugeicons/react";
import { TagsIcon, FilterMailIcon } from "@hugeicons/core-free-icons";

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
    });
    getCategories().then((data) => {
      setCategories(data);
    });
  }, []);
  return (
    <section className="w-screen min-h-screen">
      <div className="cont w-full h-full flex gap-12 pt-10">
        <div className="w-1/4 h-fit border p-3 bg-primary-foreground">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-5">
            <HugeiconsIcon icon={FilterMailIcon} />
            Categories
          </h3>
          <div className="flex flex-col gap-2">
            <div
              onClick={() => setActiveCategory("all")}
              className={`flex items-center gap-2 border p-2 hover:bg-foreground/10 cursor-pointer text-sm ${activeCategory === "all" ? "bg-foreground text-primary-foreground" : ""}`}
            >
              <HugeiconsIcon icon={TagsIcon} size={17} />
              <span>All</span>
            </div>
            {categories &&
              categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => setActiveCategory(category.name)}
                  className={`flex items-center gap-2 border p-2 hover:bg-foreground/10 hover:text-primary cursor-pointer text-sm ${activeCategory === category.name ? "bg-foreground text-primary-foreground" : ""}`}
                >
                  <HugeiconsIcon icon={TagsIcon} size={17} />
                  <span>{category.name}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {products &&
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Shop;

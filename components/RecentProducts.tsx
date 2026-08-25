"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRightIcon, Tag01Icon } from "@hugeicons/core-free-icons";
import { getRecentProducts } from "@/api/products";
import { useEffect, useState } from "react";
import Product from "@/types/productInterface";
import Image from "next/image";
import ProductCard from "./ProductCard";

const RecentProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    getRecentProducts().then((data) => {
      setProducts(data);
    });
  }, []);
  return (
    <section className="w-screen min-h-screen bg-white/80">
      <div className="cont w-full h-full flex flex-col gap-12 py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recently Added</h2>
          <button className="h-fit flex items-center gap-2 px-2 py-2 border-b border-b-primary">
            <span className="text-sm">View All</span>
            <HugeiconsIcon icon={ArrowRightIcon} size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-7">
          {products &&
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default RecentProducts;

"use client";
import { getProducts } from "@/api/products";
import { useEffect, useState } from "react";
import Product from "@/types/productInterface";
import ProductCard from "./ProductCard";

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
    });
  }, []);
  return (
    <section className="w-screen min-h-screen">
      <div className="cont w-full h-full flex flex-col gap-12 pt-10">
        <div className="grid grid-cols-4 gap-3">
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

"use client";
import Product from "@/types/productInterface";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tag01Icon,
  Remove01Icon,
  Add01Icon,
  ShoppingCart01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { useState } from "react";

const ProductCard = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (action: "add" | "remove") => {
    if (action === "add") {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };
  return (
    <div className="w-full h-full flex flex-col gap-5 p-3 border">
      <div className="w-full h-70 bg-black/10 rounded-lg">
        <Image
          src={product.image_url}
          alt={product.name}
          width={200}
          height={200}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="capitalize font-bold">{product.name}</p>
        <p className="text-sm ">&#8358;{product.price}</p>
      </div>
      <p className="text-[13px] text-gray-900 line-clamp-2">
        {product.description}
      </p>
      <div className="flex items-center gap-2">
        {product.tags && product.tags.length > 1 ? (
          product.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="text-[11px] font-light px-2 py-1 border rounded-full flex items-center gap-2 w-fit"
            >
              <HugeiconsIcon icon={Tag01Icon} size={15} /> {tag}
            </span>
          ))
        ) : (
          <span className="text-[11px] font-light px-2 py-1 border rounded-full flex items-center gap-2 w-fit">
            <HugeiconsIcon icon={Tag01Icon} size={15} /> {product.tags}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm p-2 border">{product.stock} left</p>

        <div className="flex items-center gap-2 font-bold">
          <div
            className="border p-1.5 bg-foreground/10 hover:bg-foreground/20 hover:text-primary cursor-pointer"
            onClick={() => handleQuantityChange("remove")}
          >
            <HugeiconsIcon icon={Remove01Icon} size={17} />
          </div>
          <div
            className="border p-1.5 bg-foreground/10 hover:bg-foreground/20 hover:text-primary cursor-pointer"
            onClick={() => handleQuantityChange("add")}
          >
            <HugeiconsIcon icon={Add01Icon} size={17} />
          </div>
        </div>

        <button className="bg-black text-sm text-primary-foreground font-light px-4 py-2 rounded-sm flex items-center gap-2">
          <p className="text-sm font-bold w-5 h-5 flex items-center justify-center bg-white rounded-sm text-foreground">
            {quantity}
          </p>
          <p>
            <HugeiconsIcon icon={ShoppingCart01Icon} />
          </p>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

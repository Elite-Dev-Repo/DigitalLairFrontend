"use client";
import Product from "@/types/productInterface";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tag01Icon,
  Remove01Icon,
  Add01Icon,
  ShoppingCart01Icon,
  Heart,
  HeartIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addToCart } from "@/api/cart";
import { useAuth } from "@/components/auth/auth-provider";

const ProductCard = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error("Could not add item to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleQuantityChange = (action: "add" | "remove") => {
    if (action === "add") {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };
  return (
    <div className="w-full h-full flex flex-col gap-5 rounded-2xl border bg-black/2">
      <div className="w-full h-70 flex items-center justify-center bg-[black]/10 rounded-lg relative">
        <Image
          src={product.image_url}
          alt={product.name}
          width={200}
          height={200}
          loading="eager"
          className=" object-cover rounded-xl p-5"
        />

        <div className="absolute p-2 rounded-full flex items-center justify-center top-5 right-5 bg-background/70">
          <HugeiconsIcon icon={HeartIcon} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 p-3">
        <p className="capitalize font-bold text-sm text-primary truncate">
          {product.name}
        </p>
        <p className="text-sm ">&#8358;{product.price}</p>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
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
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2 font-semibold">
          {" "}
          <p className="text-sm p-2 border">{product.stock}</p>
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

        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="bg-[#F7490A] text-sm text-primary-foreground font-light px-4 py-2 rounded-sm flex items-center gap-2 disabled:opacity-60"
        >
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

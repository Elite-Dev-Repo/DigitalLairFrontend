"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, ShoppingCart01Icon } from "@hugeicons/core-free-icons";
import RequireAuth from "@/components/auth/RequireAuth";
import { getCart, removeFromCart } from "@/api/cart";
import { createOrder } from "@/api/orders";
import { getProducts } from "@/api/products";
import { toast } from "sonner";
import type { Cart, CartItem } from "@/types/cart";
import type Product from "@/types/productInterface";
import type { CreateOrderResponse } from "@/types/order";

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const reload = useCallback(async () => {
    setError(null);
    try {
      const [cartData, productsData] = await Promise.all([
        getCart(),
        getProducts(),
      ]);
      setCart(cartData);
      setProducts(productsData);
    } catch {
      setError("Could not load your cart.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([getCart(), getProducts()])
      .then(([cartData, productsData]) => {
        if (!active) return;
        setCart(cartData);
        setProducts(productsData);
      })
      .catch(() => {
        if (active) setError("Could not load your cart.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const productById = (id: string) =>
    products.find((product) => product.id === id);

  const handleRemove = async (cartItem: CartItem) => {
    try {
      await removeFromCart(cartItem.id);
      toast.success("Item removed from cart");
      reload();
    } catch {
      toast.error("Could not remove item from cart.");
      setError("Could not remove item from cart.");
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const result: CreateOrderResponse = await createOrder();
      toast.success("Redirecting to secure payment…");
      window.location.assign(result.authorization_url);
    } catch {
      toast.error("Could not start checkout. Please try again.");
      setError("Could not start checkout. Please try again.");
      setCheckingOut(false);
    }
  };

  return (
    <RequireAuth>
      <section className="w-full grow py-10">
        <div className="cont w-full h-full flex flex-col gap-6">
          <h1 className="text-3xl font-semibold">Your Cart</h1>

          {error && (
            <p className="text-sm text-destructive border border-destructive/30 p-3">
              {error}
            </p>
          )}

          {loading ? (
            <p className="text-sm text-foreground/60">Loading your cart…</p>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 border bg-primary-foreground">
              <HugeiconsIcon icon={ShoppingCart01Icon} size={40} />
              <p className="text-foreground/70">
                Your cart is empty. Browse the shop to add items.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {cart.items.map((cartItem) => {
                  const product = productById(cartItem.product);
                  return (
                    <div
                      key={cartItem.id}
                      className="flex items-center gap-4 p-4 border bg-primary-foreground flex-wrap"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black/10 rounded-lg overflow-hidden shrink-0">
                        {product && (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <p className="font-semibold truncate">
                          {product ? product.name : cartItem.product}
                        </p>
                        <p className="text-sm text-foreground/70">
                          Qty: {cartItem.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        &#8358;{Number(cartItem.subtotal).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemove(cartItem)}
                        className="p-2 border hover:bg-foreground/10 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="ml-auto w-full max-w-sm flex flex-col gap-3 p-4 border bg-primary-foreground">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground/70">Total</p>
                  <p className="text-xl font-semibold">
                    &#8358;{Number(cart.total).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="bg-primary text-primary-foreground font-light px-4 py-2.5 rounded-sm disabled:opacity-60"
                >
                  {checkingOut ? "Redirecting to payment…" : "Checkout"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </RequireAuth>
  );
};

export default CartPage;

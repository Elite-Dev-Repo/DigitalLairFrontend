"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart01Icon, ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/components/auth/auth-provider";
import { getCart } from "@/api/cart";
import { getProducts } from "@/api/products";
import { createOrder } from "@/api/orders";
import { toast } from "sonner";
import type { Cart } from "@/types/cart";
import type Product from "@/types/productInterface";
import type { CreateOrderResponse } from "@/types/order";

type CheckoutForm = {
  full_name: string;
  email: string;
  phone: string;
  delivery_address: string;
  city: string;
  state: string;
  postal_code: string;
  delivery_notes: string;
};

type FormErrors = Partial<Record<keyof CheckoutForm, string>>;

const initialForm: CheckoutForm = {
  full_name: "",
  email: "",
  phone: "",
  delivery_address: "",
  city: "",
  state: "",
  postal_code: "",
  delivery_notes: "",
};

const requiredFields: (keyof CheckoutForm)[] = [
  "full_name",
  "email",
  "phone",
  "delivery_address",
  "city",
  "state",
  "postal_code",
];

const fieldLabels: Record<keyof CheckoutForm, string> = {
  full_name: "Full Name",
  email: "Email Address",
  phone: "Phone Number",
  delivery_address: "Delivery Address",
  city: "City",
  state: "State / Province",
  postal_code: "Postal Code",
  delivery_notes: "Delivery Notes (Optional)",
};

const inputBase =
  "border p-2.5 text-sm outline-none focus:border-primary w-full bg-white";
const errorInput = "border-destructive focus:border-destructive";

export default function CheckoutPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    let active = true;
    Promise.all([getCart(), getProducts()])
      .then(([cartData, productsData]) => {
        if (!active) return;
        setCart(cartData);
        setProducts(productsData);
      })
      .catch(() => {
        if (active) setError("Could not load checkout data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Prefill from authenticated user
  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm((prev) => ({
      ...prev,
      full_name:
        prev.full_name ||
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        "",
      email: prev.email || user.email || "",
    }));
  }, [user]);

  const productById = (id: string) => products.find((p) => p.id === id);

  const handleChange =
    (field: keyof CheckoutForm) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const validate = (): boolean => {
    const next: FormErrors = {};
    requiredFields.forEach((field) => {
      if (!form[field].trim()) {
        next[field] = `${fieldLabels[field]} is required`;
      }
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address";
    }
    if (form.phone && form.phone.trim().length < 7) {
      next.phone = "Enter a valid phone number";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setSubmitting(true);
    try {
      // Build metadata exactly as expected by Order.metadata JSONField
      const metadata: Record<string, string> = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        delivery_address: form.delivery_address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        postal_code: form.postal_code.trim(),
      };
      if (form.delivery_notes.trim()) {
        metadata.delivery_notes = form.delivery_notes.trim();
      }

      const result: CreateOrderResponse = await createOrder(metadata);
      toast.success("Order created. Redirecting to payment…");
      window.location.assign(result.authorization_url);
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as { response?: { data?: { error?: string } } }).response?.data
          ?.error
          ? (err as { response: { data: { error: string } } }).response.data
              .error
          : "Could not place order. Please try again.";
      setError(message);
      toast.error(message);
      setSubmitting(false);
    }
  };

  return (
    <RequireAuth>
      <section className="w-full grow py-10">
        <div className="cont w-full h-full flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-sm border px-3 py-1.5 bg-primary-foreground hover:bg-foreground/5"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
              Back to Cart
            </Link>
            <h1 className="text-3xl font-semibold">Checkout</h1>
          </div>

          {error && (
            <p className="text-sm text-destructive border border-destructive/30 p-3 bg-primary-foreground">
              {error}
            </p>
          )}

          {loading ? (
            <p className="text-sm text-foreground/60">Loading checkout…</p>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 border bg-primary-foreground">
              <HugeiconsIcon icon={ShoppingCart01Icon} size={40} />
              <p className="text-foreground/70">
                Your cart is empty. Add items before checking out.
              </p>
              <Link
                href="/"
                className="bg-primary text-primary-foreground font-light px-4 py-2.5 rounded-sm text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
              {/* Delivery Details Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="lg:col-span-3 flex flex-col gap-6 p-6 border bg-primary-foreground"
              >
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold">Delivery Details</h2>
                  <p className="text-sm text-foreground/60">
                    These details will be saved as{" "}
                    <span className="font-medium text-foreground">metadata</span>{" "}
                    on your order for shipping & contact.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium">
                      Full Name <span className="text-destructive">*</span>
                    </span>
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={handleChange("full_name")}
                      placeholder="John Doe"
                      className={`${inputBase} ${errors.full_name ? errorInput : ""}`}
                    />
                    {errors.full_name && (
                      <span className="text-xs text-destructive">
                        {errors.full_name}
                      </span>
                    )}
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium">
                      Email Address <span className="text-destructive">*</span>
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      placeholder="you@example.com"
                      className={`${inputBase} ${errors.email ? errorInput : ""}`}
                    />
                    {errors.email && (
                      <span className="text-xs text-destructive">
                        {errors.email}
                      </span>
                    )}
                  </label>
                </div>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">
                    Phone Number <span className="text-destructive">*</span>
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="+234 801 234 5678"
                    className={`${inputBase} ${errors.phone ? errorInput : ""}`}
                  />
                  {errors.phone && (
                    <span className="text-xs text-destructive">
                      {errors.phone}
                    </span>
                  )}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">
                    Delivery Address <span className="text-destructive">*</span>
                  </span>
                  <input
                    type="text"
                    value={form.delivery_address}
                    onChange={handleChange("delivery_address")}
                    placeholder="Street, house number, apartment"
                    className={`${inputBase} ${errors.delivery_address ? errorInput : ""}`}
                  />
                  {errors.delivery_address && (
                    <span className="text-xs text-destructive">
                      {errors.delivery_address}
                    </span>
                  )}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium">
                      City <span className="text-destructive">*</span>
                    </span>
                    <input
                      type="text"
                      value={form.city}
                      onChange={handleChange("city")}
                      placeholder="Lagos"
                      className={`${inputBase} ${errors.city ? errorInput : ""}`}
                    />
                    {errors.city && (
                      <span className="text-xs text-destructive">
                        {errors.city}
                      </span>
                    )}
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium">
                      State <span className="text-destructive">*</span>
                    </span>
                    <input
                      type="text"
                      value={form.state}
                      onChange={handleChange("state")}
                      placeholder="Lagos"
                      className={`${inputBase} ${errors.state ? errorInput : ""}`}
                    />
                    {errors.state && (
                      <span className="text-xs text-destructive">
                        {errors.state}
                      </span>
                    )}
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium">
                      Postal Code <span className="text-destructive">*</span>
                    </span>
                    <input
                      type="text"
                      value={form.postal_code}
                      onChange={handleChange("postal_code")}
                      placeholder="100001"
                      className={`${inputBase} ${errors.postal_code ? errorInput : ""}`}
                    />
                    {errors.postal_code && (
                      <span className="text-xs text-destructive">
                        {errors.postal_code}
                      </span>
                    )}
                  </label>
                </div>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">
                    Delivery Notes
                    <span className="text-foreground/50 font-normal">
                      {" "}
                      (optional)
                    </span>
                  </span>
                  <textarea
                    value={form.delivery_notes}
                    onChange={handleChange("delivery_notes")}
                    placeholder="Any instructions for delivery? e.g. Leave at gate, call on arrival"
                    rows={3}
                    className={`${inputBase} resize-none ${errors.delivery_notes ? errorInput : ""}`}
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 bg-primary text-primary-foreground font-light px-4 py-3 rounded-sm disabled:opacity-60 text-base"
                >
                  {submitting
                    ? "Placing order…"
                    : `Pay  \u20A6${Number(cart.total).toFixed(2)}`}
                </button>

                <p className="text-xs text-foreground/50 text-center">
                  You will be redirected to a secure Paystack checkout after
                  placing your order.
                </p>
              </form>

              {/* Order Summary */}
              <div className="lg:col-span-2 flex flex-col gap-4 p-6 border bg-primary-foreground lg:sticky lg:top-6">
                <h2 className="text-xl font-semibold">
                  Order Summary ({cart.items.length} {cart.items.length === 1 ? "item" : "items"})
                </h2>

                <div className="flex flex-col gap-3 max-h-[40vh] overflow-y-auto pr-1">
                  {cart.items.map((item) => {
                    const product = productById(item.product);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 py-3 border-b last:border-0"
                      >
                        <div className="w-16 h-16 bg-black/10 rounded-lg overflow-hidden shrink-0">
                          {product && (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {product ? product.name : item.product}
                          </p>
                          <p className="text-xs text-foreground/60">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium shrink-0">
                          &#8358;{Number(item.subtotal).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/70">Subtotal</span>
                    <span className="font-medium">
                      &#8358;{Number(cart.total).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/70">Delivery</span>
                    <span className="text-foreground/60">Calculated at next step</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t font-semibold">
                    <span>Total</span>
                    <span className="text-lg">
                      &#8358;{Number(cart.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </RequireAuth>
  );
}

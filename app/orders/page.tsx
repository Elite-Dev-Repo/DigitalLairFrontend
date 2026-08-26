"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons";
import RequireAuth from "@/components/auth/RequireAuth";
import { getOrders } from "@/api/orders";
import type { Order } from "@/types/order";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrders()
      .then((data) => setOrders(data))
      .catch(() => setError("Could not load your orders."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <RequireAuth>
      <section className="w-full grow py-10">
        <div className="cont w-full h-full flex flex-col gap-6">
          <h1 className="text-3xl font-semibold">Your Orders</h1>

          {error && (
            <p className="text-sm text-destructive border border-destructive/30 p-3">
              {error}
            </p>
          )}

          {loading ? (
            <p className="text-sm text-foreground/60">Loading your orders…</p>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 border bg-primary-foreground">
              <HugeiconsIcon icon={ShoppingBag01Icon} size={40} />
              <p className="text-foreground/70">
                You have not placed any orders yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border bg-primary-foreground"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold break-all">{order.reference}</p>
                    <p className="text-sm text-foreground/70">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"} ·{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span
                      className={`text-xs font-medium px-2 py-1 border ${
                        order.status === "Paid"
                          ? "border-green-600 text-green-700"
                          : "text-foreground/70"
                      }`}
                    >
                      {order.status}
                    </span>
                    <p className="font-medium">
                      &#8358;{Number(order.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </RequireAuth>
  );
};

export default OrdersPage;

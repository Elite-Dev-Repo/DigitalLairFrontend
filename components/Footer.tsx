"use client";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { BoomBoxIcon } from "@hugeicons/core-free-icons";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-primary-foreground/10 w-full bg-primary text-primary-foreground">
      <div className="cont w-full py-10 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={BoomBoxIcon} size={24} />
              <span className="text-xl font-semibold">Digital Lair</span>
            </div>
            <p className="text-sm text-primary-foreground/70 max-w-sm">
              Everything you need for your digital life.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/#shop"
              className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/cart"
              className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
            >
              Cart
            </Link>
            <Link
              href="/orders"
              className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
            >
              Orders
            </Link>
          </nav>
        </div>

        <div className="border-t border-primary-foreground/10 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} Digital Lair. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BoomBoxIcon,
  ShoppingCart01Icon,
  ShoppingBag01Icon,
  Logout01Icon,
  UserIcon,
  Login01Icon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "./auth/auth-provider";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { icon: <HugeiconsIcon icon={ShoppingCart01Icon} />, href: "/cart" },
    { icon: <HugeiconsIcon icon={ShoppingBag01Icon} />, href: "/orders" },
  ];

  const displayName = user?.first_name || user?.email;

  return (
    <nav className="h-auto min-h-17 border-b border-b-primary">
      <div className="cont w-full py-3 sm:py-0 sm:h-17 flex flex-wrap items-center justify-between gap-y-3">
        <Link href="/">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={BoomBoxIcon} size={27} />
          </div>
        </Link>

        <h1 className="order-3 w-full text-center lg:order-none lg:w-auto text-xl sm:text-2xl lg:text-3xl tracking-[0.35em] lg:tracking-[0.5em] font-indie text-foreground px-0 sm:px-4 py-0">
          Digital Lair
        </h1>
        <div className="order-2 flex items-center gap-4 sm:gap-7">
          {navLinks.map((link, index) => (
            <Link key={index} href={link.href}>
              {link.icon}
            </Link>
          ))}
          {isAuthenticated && user ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <HugeiconsIcon icon={UserIcon} size={18} />
                <span className="text-sm font-medium max-w-32 truncate">
                  {displayName}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-sm hover:text-primary"
                aria-label="Sign out"
              >
                <HugeiconsIcon icon={Logout01Icon} size={18} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <Link
              href={`/auth/login${
                pathname && pathname !== "/auth/login"
                  ? `?redirect=${encodeURIComponent(pathname)}`
                  : ""
              }`}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-light px-3 sm:px-4 py-2 rounded-sm"
            >
              <HugeiconsIcon icon={Login01Icon} size={17} />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
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
    <nav className="h-17 border-b border-b-primary">
      <div className="cont w-full h-full flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={BoomBoxIcon} size={27} />
          </div>
        </Link>

        <h1 className="text-3xl tracking-[0.5em] font-indie text-foreground px-4 py-2">
          Digital Lair
        </h1>
        <div className="flex items-center gap-7">
          {navLinks.map((link, index) => (
            <Link key={index} href={link.href}>
              {link.icon}
            </Link>
          ))}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-7">
              <div className="flex items-center gap-2">
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
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href={`/auth/login${
                pathname && pathname !== "/auth/login"
                  ? `?redirect=${encodeURIComponent(pathname)}`
                  : ""
              }`}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-light px-4 py-2 rounded-sm"
            >
              <HugeiconsIcon icon={Login01Icon} size={17} />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
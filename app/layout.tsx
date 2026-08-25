import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import {
  BoomBoxIcon,
  ShoppingCart01Icon,
  ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "200", "300"],
});

export const metadata: Metadata = {
  title: "DigitalLair Store",
  description: "Everything you need for your digital life.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const navLinks = [
    { icon: <HugeiconsIcon icon={ShoppingCart01Icon} />, href: "/cart" },
    { icon: <HugeiconsIcon icon={ShoppingBag01Icon} />, href: "/orders" },
  ];
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="h-17 border-b border-b-primary">
          <div className="cont w-full h-full  flex items-center justify-between">
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
              <button className="bg-primary text-primary-foreground font-light px-4 py-2 rounded-sm">
                Sign In
              </button>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}

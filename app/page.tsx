import Link from "next/link";
import Image from "next/image";
import speaker_hero from "@/public/images/speaker-hero3.png";
import { HugeiconsIcon } from "@hugeicons/react";
import RecentProducts from "@/components/RecentProducts";
import Shop from "@/components/Shop";
import {
  BoomBoxIcon,
  ShoppingCart01Icon,
  ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";

export default function LandingPage() {
  const navLinks = [
    { icon: <HugeiconsIcon icon={ShoppingCart01Icon} />, href: "/cart" },
    { icon: <HugeiconsIcon icon={ShoppingBag01Icon} />, href: "/orders" },
  ];
  return (
    <>
      <section className="h-screen w-screen">
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

        <header className="cont w-full h-[70vh] px-5">
          <div className="w-full h-full flex items-center justify-between">
            <div className="w-1/2 h-full flex flex-col items-start justify-center">
              <h1 className="text-5xl font-semibold text-foreground px-4 py-2">
                High quality digital products <br /> for your everyday needs.
              </h1>
              <p className="text-foreground px-4 py-2">
                At Digital Lair, we do not just make promises. There’s a very
                long list of satisfied customers, and we are glad to share the
                goodness of digital products with you.
              </p>
              <button className="bg-primary text-primary-foreground font-light px-4 py-2 rounded-sm mt-5">
                Shop Now
              </button>
            </div>

            <div className="w-1/2 h-full flex items-center justify-center">
              <Image
                src={speaker_hero}
                alt="Hero"
                width={600}
                height={600}
                className="drop-shadow-2xl"
              />
            </div>
          </div>
        </header>

        <RecentProducts />
        <Shop />
      </section>
    </>
  );
}

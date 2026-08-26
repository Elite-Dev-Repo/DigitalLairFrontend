"use client";

import Image from "next/image";
import Link from "next/link";
import electronicsImg from "@/public/images/electronics.jpg";
import logisticImg from "@/public/images/logistic.jpg";

export default function FeaturedSections() {
  return (
    <>
      {/* Electronics Section */}
      <section className="w-full py-16 lg:py-24 bg-white/50 border-y border-primary/10">
        <div className="cont flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start justify-center order-2 lg:order-0">
            <span className="text-primary/70 font-semibold tracking-wider uppercase text-xs sm:text-sm mb-3">
              Premium Electronic Hub
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4 tracking-tight">
              Power your day with cutting-edge tech.
            </h2>
            <p className="text-foreground/80 text-base sm:text-lg leading-relaxed mb-6 max-w-xl">
              Explore our curated selection of high-end electronics. From
              premium audio gear to smart home solutions, we bring you
              cutting-edge devices designed to elevate your everyday routines.
            </p>
            <Link href="#shop">
              <button className="bg-primary hover:bg-primary/95 text-primary-foreground font-medium px-6 py-3 rounded-md transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 cursor-pointer">
                Shop Electronics
              </button>
            </Link>
          </div>

          {/* Image Content */}
          <div className="w-full lg:w-1/2 flex items-center justify-center order-1 lg:order-0">
            <div className="relative w-full aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border border-foreground/5 group">
              <Image
                src={electronicsImg}
                alt="High-end sound speaker and smart electronics"
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Logistics Section */}
      <section className="w-full py-16 lg:py-24 bg-transparent">
        <div className="cont flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Image Content */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="relative w-full aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border border-foreground/5 group">
              <Image
                src={logisticImg}
                alt="Global fast delivery and secure logistical service"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start justify-center">
            <span className="text-primary/70 font-semibold tracking-wider uppercase text-xs sm:text-sm mb-3">
              Reliable Fulfilment
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4 tracking-tight">
              Seamless delivery straight to your doorstep.
            </h2>
            <p className="text-foreground/80 text-base sm:text-lg leading-relaxed mb-6 max-w-xl">
              We ensure your premium items reach you in perfect condition. Enjoy
              safe professional packaging, fully tracked shipments, and swift
              delivery times managed by a top-tier shipping team.
            </p>
            <Link href="/orders">
              <button className="bg-primary hover:bg-primary/95 text-primary-foreground font-medium px-6 py-3 rounded-md transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 cursor-pointer">
                Track Deliveries
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

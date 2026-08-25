import Link from "next/link";
import Image from "next/image";
import speaker_hero from "@/public/images/speaker-hero3.png";
import RecentProducts from "@/components/RecentProducts";
import Shop from "@/components/Shop";

export default function LandingPage() {
  return (
    <>
      <section className="h-screen w-screen">
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

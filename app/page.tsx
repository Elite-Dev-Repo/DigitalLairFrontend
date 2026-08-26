import Image from "next/image";
import speaker_hero from "@/public/images/speaker-hero3.png";
import RecentProducts from "@/components/RecentProducts";
import FeaturedSections from "@/components/FeaturedSections";
import Shop from "@/components/Shop";

export default function LandingPage() {
  return (
    <>
      <section className="w-full grow flex flex-col">
        <header className="cont w-full lg:h-[70vh] px-5 py-10 lg:py-0">
          <div className="w-full h-full flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="w-full lg:w-1/2 h-full flex flex-col items-start justify-center order-2 lg:order-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground px-4 py-2 text-center lg:text-left">
                High quality digital products <br /> for your everyday needs.
              </h1>
              <p className="text-foreground px-4 py-2 text-center lg:text-left">
                At Digital Lair, we do not just make promises. There’s a very
                long list of satisfied customers, and we are glad to share the
                goodness of digital products with you.
              </p>
              <div className="w-full flex justify-center lg:justify-start">
                <button className="bg-primary text-primary-foreground font-light px-4 py-2 rounded-sm mt-5">
                  Shop Now
                </button>
              </div>
            </div>

            <div className="w-full lg:w-1/2 h-full flex items-center justify-center order-1 lg:order-0">
              <Image
                src={speaker_hero}
                alt="Hero"
                width={600}
                height={600}
                className="w-56 sm:w-80 lg:w-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </header>

        <RecentProducts />
        <FeaturedSections />
        <Shop />
      </section>
    </>
  );
}

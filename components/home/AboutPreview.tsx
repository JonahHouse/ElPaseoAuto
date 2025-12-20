import Link from "next/link";
import Button from "@/components/ui/Button";

export default function AboutPreview() {
  return (
    <section className="bg-charcoal">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image Side - Full bleed with min-height on mobile, stretches to content on desktop */}
        <div
          className="relative h-[400px] lg:h-auto bg-cover bg-center grayscale"
          style={{ backgroundImage: "url('/boutique_image.jpg')" }}
        >
          {/* Accessible hidden image for SEO */}
          <span className="sr-only">El Paseo Auto Group Showroom</span>
        </div>

        {/* Content Side */}
        <div className="flex items-center py-20 lg:py-28 px-8 lg:px-16">
          <div>
            <p className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-4">
              About Us
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-white font-semibold mb-6">
              Palm Desert&apos;s Boutique Dealership
            </h2>
            <p className="text-gray-light leading-relaxed mb-6">
              We&apos;re not the biggest lot in the valley, and that&apos;s by design. Our
              focus is a small, carefully selected inventory of high-end luxury and
              unique vehicles—the kind of cars that turn heads and hold their value.
            </p>
            <p className="text-gray-light leading-relaxed mb-8">
              Located in the heart of Palm Desert&apos;s famed El Paseo shopping district,
              our showroom offers an unparalleled browsing experience in an elegant,
              pressure-free environment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/about">
                <Button>Learn More</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">Visit Our Showroom</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

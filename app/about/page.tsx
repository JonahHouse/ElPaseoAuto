import { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { getRandomHeaderImage } from "@/lib/headerImages";

export const metadata: Metadata = {
  title: "About Us | El Paseo Auto Group",
  description:
    "Learn about El Paseo Auto Group, Palm Desert's premier destination for luxury and exotic automobiles.",
};

export default function AboutPage() {
  const heroImage = getRandomHeaderImage();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-4">
              About Us
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-semibold mb-6">
              Where Passion Meets Purpose
            </h1>
            <p className="text-gray-light text-lg leading-relaxed mb-8">
              More than a dealership. A destination for those who appreciate the
              art of the automobile.
            </p>
            <Link href="/inventory">
              <Button size="lg">Browse Inventory</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Content Side */}
          <div className="flex items-center py-20 lg:py-28 px-8 lg:px-16">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal font-semibold mb-6">
                A Different Kind of Dealership
              </h2>
              <div className="space-y-4 text-gray leading-relaxed">
                <p>
                  With years of experience serving the Coachella Valley, El Paseo Auto Group
                  is dedicated to offering exceptional pre-owned luxury and exotic vehicles.
                  From the moment you walk through our doors, we&apos;re committed to providing
                  you with an outstanding car-buying experience.
                </p>
                <p>
                  We understand that buying a luxury vehicle is personal. That&apos;s why we
                  take the time to understand what you&apos;re looking for, whether it&apos;s a
                  weekend cruiser, a daily driver that turns heads, or that dream car
                  you&apos;ve always wanted.
                </p>
                <p>
                  Our goal is simple: we want you to be so delighted with your purchase
                  that you&apos;ll return when it&apos;s time for your next vehicle and recommend
                  us to friends and family. Customer referrals are the ultimate compliment,
                  and they&apos;re the foundation of our business.
                </p>
              </div>
            </div>
          </div>
          {/* Image Side */}
          <div
            className="h-[400px] lg:h-auto bg-cover bg-center grayscale"
            style={{ backgroundImage: "url('/images/header_backgrounds/rolls_royce_interior.jpg')" }}
          />
        </div>
      </section>

      {/* Approach Section */}
      <section className="bg-off-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Side */}
          <div
            className="order-2 lg:order-1 h-[400px] lg:h-auto bg-cover bg-center grayscale"
            style={{ backgroundImage: "url('/images/header_backgrounds/mercedes_interior.jpg')" }}
          />
          {/* Content Side */}
          <div className="order-1 lg:order-2 flex items-center py-20 lg:py-28 px-8 lg:px-16">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal font-semibold mb-6">
                The Right Fit
              </h2>
              <div className="space-y-4 text-gray leading-relaxed">
                <p>
                  With many vehicle shopping options available today, we differentiate
                  ourselves by truly understanding our local car-buying community and
                  satisfying its unique needs.
                </p>
                <p>
                  We&apos;re not about volume or pressure. We&apos;re about helping valued
                  customers like you find the vehicle that&apos;s the perfect fit—for your
                  lifestyle, your taste, and your budget.
                </p>
                <p>
                  Feel free to browse our inventory online and check out our featured
                  vehicles. If you see something you like, submit a quote request or
                  contact us to schedule a viewing. We&apos;re happy to work around your
                  schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl text-charcoal font-semibold mb-4">
              What Sets Us Apart
            </h2>
            <p className="text-gray max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-off-white p-8 rounded-sm text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-charcoal font-semibold mb-3">
                No Pressure
              </h3>
              <p className="text-gray text-sm">
                Take your time. Ask questions. We&apos;re here to help you make the right
                decision, not push you into a quick sale.
              </p>
            </div>

            <div className="bg-off-white p-8 rounded-sm text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-charcoal font-semibold mb-3">
                Fair Pricing
              </h3>
              <p className="text-gray text-sm">
                Great vehicles at great prices. No hidden fees, no surprises.
                What you see is what you get.
              </p>
            </div>

            <div className="bg-off-white p-8 rounded-sm text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-charcoal font-semibold mb-3">
                Real Relationships
              </h3>
              <p className="text-gray text-sm">
                Many customers have been with us for years. We value long-term
                relationships over one-time transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-charcoal">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-3xl text-white font-semibold mb-6">
            Come See Us
          </h2>
          <p className="text-gray-light max-w-2xl mx-auto mb-10">
            To learn more about how we can help with your next vehicle purchase,
            give us a call or stop by in person. We look forward to meeting you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/inventory">
              <Button size="lg">Browse Inventory</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

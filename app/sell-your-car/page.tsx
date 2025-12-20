import { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { getRandomHeaderImage } from "@/lib/headerImages";

export const metadata: Metadata = {
  title: "Sell Your Car | El Paseo Auto Group",
  description:
    "Get a fair cash offer for your luxury or exotic vehicle. Quick, hassle-free process with same-day payment available.",
};

const benefits = [
  {
    title: "Fair Market Value",
    description:
      "We offer competitive prices based on current market conditions and your vehicle's condition.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Quick Process",
    description:
      "Get an offer within 24 hours. No waiting weeks for your car to sell on a marketplace.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "No Hassle",
    description:
      "Skip the tire-kickers, lowballers, and strangers coming to your home. We handle everything.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Same-Day Payment",
    description:
      "Once we agree on a price, get paid the same day. Bank wire or certified check available.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const steps = [
  {
    number: "01",
    title: "Tell Us About Your Car",
    description:
      "Share your vehicle's details including year, make, model, mileage, and condition.",
  },
  {
    number: "02",
    title: "Get Your Offer",
    description:
      "We'll review your information and provide a competitive cash offer within 24 hours.",
  },
  {
    number: "03",
    title: "Schedule Inspection",
    description:
      "Bring your vehicle in for a quick inspection to verify condition and finalize the offer.",
  },
  {
    number: "04",
    title: "Get Paid",
    description:
      "Accept the offer and receive payment the same day. We handle all the paperwork.",
  },
];

export default function SellYourCarPage() {
  const heroImage = getRandomHeaderImage();

  return (
    <div className="pt-24">
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
              Sell Your Vehicle
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-semibold mb-6">
              Get a Fair Cash Offer Today
            </h1>
            <p className="text-gray-light text-lg leading-relaxed mb-8">
              Skip the hassle of private sales. We buy luxury and exotic vehicles
              and offer competitive prices with same-day payment.
            </p>
            <Link href="/contact">
              <Button size="lg">Get Your Offer</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl text-charcoal font-semibold mb-4">
              Why Sell to Us?
            </h2>
            <p className="text-gray max-w-2xl mx-auto">
              We make selling your luxury vehicle simple, fast, and profitable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-6">
                  {benefit.icon}
                </div>
                <h3 className="font-display text-xl text-charcoal font-semibold mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl text-charcoal font-semibold mb-4">
              How It Works
            </h2>
            <p className="text-gray max-w-2xl mx-auto">
              Selling your car has never been easier. Here&apos;s our simple four-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-sm shadow-luxury h-full">
                  <span className="font-display text-5xl text-gold/20 font-bold">
                    {step.number}
                  </span>
                  <h3 className="font-display text-xl text-charcoal font-semibold mt-4 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray text-sm">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gold" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Buy Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl text-charcoal font-semibold mb-4">
              What We Buy
            </h2>
            <p className="text-gray mb-10">
              We specialize in luxury, exotic, and unique vehicles. If you have something
              special, we want to hear from you.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
              {[
                "Exotic Sports Cars",
                "Luxury Sedans",
                "High-End SUVs",
                "Classic & Collectible",
                "Performance Vehicles",
                "Limited Editions",
              ].map((type) => (
                <div key={type} className="flex items-center gap-2 text-gray">
                  <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {type}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-charcoal">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-3xl text-white font-semibold mb-6">
            Ready to Sell?
          </h2>
          <p className="text-gray-light max-w-2xl mx-auto mb-10">
            Contact us today with your vehicle details and we&apos;ll get back to you
            with a competitive offer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">Get Your Offer</Button>
            </Link>
            <a href={`tel:+1${siteConfig.phoneRaw}`}>
              <Button variant="outline" size="lg">
                Call {siteConfig.phone}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

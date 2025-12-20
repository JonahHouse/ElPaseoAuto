import { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { getRandomHeaderImage } from "@/lib/headerImages";

export const metadata: Metadata = {
  title: "Financing | El Paseo Auto Group",
  description:
    "Flexible financing options for your luxury vehicle purchase. Work with our team to find the perfect payment solution.",
};

const benefits = [
  {
    title: "Competitive Rates",
    description:
      "We work with multiple lenders to secure the best rates available for your credit profile.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Flexible Terms",
    description:
      "Choose from a variety of loan terms and down payment options to fit your budget.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Quick Approval",
    description:
      "Get pre-approved in minutes. Our streamlined process gets you behind the wheel faster.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "All Credit Welcome",
    description:
      "Whether your credit is excellent, good, or needs work, we have options for you.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const steps = [
  {
    number: "01",
    title: "Apply Online or In-Person",
    description:
      "Fill out our simple application form online or visit our showroom to speak with a finance specialist.",
  },
  {
    number: "02",
    title: "Get Pre-Approved",
    description:
      "Our team will review your application and provide financing options within 24 hours.",
  },
  {
    number: "03",
    title: "Choose Your Vehicle",
    description:
      "Browse our inventory knowing your budget and financing terms upfront.",
  },
  {
    number: "04",
    title: "Finalize & Drive",
    description:
      "Complete the paperwork and drive away in your dream vehicle the same day.",
  },
];

export default function FinancingPage() {
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
              Financing Options
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-semibold mb-6">
              Drive Your Dream Today
            </h1>
            <p className="text-gray-light text-lg leading-relaxed mb-8">
              Don&apos;t let financing hold you back. We offer flexible options to help
              you get behind the wheel of your perfect luxury vehicle.
            </p>
            <Link href="/contact">
              <Button size="lg">Get Pre-Approved</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl text-charcoal font-semibold mb-4">
              Why Finance With Us?
            </h2>
            <p className="text-gray max-w-2xl mx-auto">
              We make the financing process simple, transparent, and tailored to your needs.
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
              Getting financed is easy with our streamlined four-step process.
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

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl text-charcoal font-semibold mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              <div className="border-b border-gray-light/20 pb-6">
                <h4 className="font-display text-lg text-charcoal font-semibold mb-2">
                  What credit score do I need?
                </h4>
                <p className="text-gray">
                  We work with all credit profiles. While higher scores typically
                  receive better rates, we have financing options available for
                  various credit situations.
                </p>
              </div>
              <div className="border-b border-gray-light/20 pb-6">
                <h4 className="font-display text-lg text-charcoal font-semibold mb-2">
                  What documents do I need?
                </h4>
                <p className="text-gray">
                  Typically you&apos;ll need a valid driver&apos;s license, proof of income
                  (pay stubs or tax returns), proof of residence, and references.
                </p>
              </div>
              <div className="border-b border-gray-light/20 pb-6">
                <h4 className="font-display text-lg text-charcoal font-semibold mb-2">
                  Can I trade in my current vehicle?
                </h4>
                <p className="text-gray">
                  Absolutely! We accept trade-ins and will provide a fair market
                  value assessment. Your trade-in value can be applied toward your
                  down payment.
                </p>
              </div>
              <div className="pb-6">
                <h4 className="font-display text-lg text-charcoal font-semibold mb-2">
                  How long does approval take?
                </h4>
                <p className="text-gray">
                  In most cases, we can provide a financing decision within 24 hours.
                  Many applications receive same-day approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-charcoal">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-3xl text-white font-semibold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-gray-light max-w-2xl mx-auto mb-10">
            Contact us today to discuss your financing options and find the perfect
            vehicle for your lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">Apply Now</Button>
            </Link>
            <Link href="/inventory">
              <Button variant="outline" size="lg">
                Browse Inventory
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { getRandomHeaderImage } from "@/lib/headerImages";

export const metadata: Metadata = {
  title: "Consignment | El Paseo Auto Group",
  description:
    "Let us sell your luxury or exotic vehicle for you. Professional marketing, qualified buyers, and maximum value for your car.",
};

const benefits = [
  {
    title: "Maximum Value",
    description:
      "Consignment often yields higher returns than trade-in or direct sale. We work to get you top dollar.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: "Professional Marketing",
    description:
      "Your vehicle gets showcased in our showroom and online presence, reaching serious luxury car buyers.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Qualified Buyers",
    description:
      "We screen and qualify all potential buyers, so you only deal with serious, pre-approved customers.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Hassle-Free",
    description:
      "We handle showings, test drives, negotiations, and paperwork. You just wait for the sale.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
];

const steps = [
  {
    number: "01",
    title: "Consultation",
    description:
      "We evaluate your vehicle and discuss pricing strategy, timeline, and your goals.",
  },
  {
    number: "02",
    title: "Preparation",
    description:
      "We photograph, detail, and prepare your vehicle for our showroom and online listings.",
  },
  {
    number: "03",
    title: "Marketing",
    description:
      "Your car is showcased to our network of luxury buyers and featured in our inventory.",
  },
  {
    number: "04",
    title: "Sale & Payment",
    description:
      "We handle negotiations and paperwork. You receive payment once the sale is complete.",
  },
];

const faqs = [
  {
    question: "How long does consignment typically take?",
    answer:
      "Most vehicles sell within 30-90 days, depending on the vehicle type, pricing, and market conditions. Unique or highly desirable vehicles often sell faster.",
  },
  {
    question: "What are your consignment fees?",
    answer:
      "Our fees are competitive and based on the vehicle's value. We'll discuss all terms upfront during our initial consultation so there are no surprises.",
  },
  {
    question: "Can I still drive my car while it's on consignment?",
    answer:
      "We recommend keeping the vehicle at our facility for optimal presentation and availability for showings, but we can discuss arrangements based on your situation.",
  },
  {
    question: "What if my car doesn't sell?",
    answer:
      "If your vehicle hasn't sold after the agreed period, we'll discuss options including price adjustments or returning the vehicle to you with no obligation.",
  },
];

export default function ConsignmentPage() {
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
              Consignment Services
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-semibold mb-6">
              Let Us Sell Your Vehicle
            </h1>
            <p className="text-gray-light text-lg leading-relaxed mb-8">
              Get maximum value for your luxury or exotic vehicle. We handle the
              marketing, showings, and negotiations while you wait for the perfect buyer.
            </p>
            <Link href="/contact">
              <Button size="lg">Start Consignment</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl text-charcoal font-semibold mb-4">
              Why Consign With Us?
            </h2>
            <p className="text-gray max-w-2xl mx-auto">
              Our consignment program is designed to get you the best price with the least effort.
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
              How Consignment Works
            </h2>
            <p className="text-gray max-w-2xl mx-auto">
              Our streamlined process makes selling your vehicle simple and stress-free.
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

      {/* Consignment vs Selling Comparison */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl text-charcoal font-semibold mb-4">
                Consignment vs. Direct Sale
              </h2>
              <p className="text-gray">
                Not sure which option is right for you? Here&apos;s a quick comparison.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-off-white p-8 rounded-sm">
                <h3 className="font-display text-xl text-charcoal font-semibold mb-4">
                  Consignment
                </h3>
                <ul className="space-y-3">
                  {[
                    "Higher potential sale price",
                    "We handle all showings & negotiations",
                    "Professional marketing & presentation",
                    "Payment when vehicle sells",
                    "Best for unique/high-value vehicles",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-gray text-sm">
                      <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-off-white p-8 rounded-sm">
                <h3 className="font-display text-xl text-charcoal font-semibold mb-4">
                  Direct Sale
                </h3>
                <ul className="space-y-3">
                  {[
                    "Immediate cash payment",
                    "No waiting for a buyer",
                    "Quick, simple transaction",
                    "Slightly lower price than consignment",
                    "Best when you need funds quickly",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-gray text-sm">
                      <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/sell-your-car" className="inline-block mt-6 text-gold hover:text-gold-dark text-sm font-medium transition-colors">
                  Learn about selling directly &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl text-charcoal font-semibold mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className={index < faqs.length - 1 ? "border-b border-gray-light/20 pb-6" : "pb-6"}>
                  <h4 className="font-display text-lg text-charcoal font-semibold mb-2">
                    {faq.question}
                  </h4>
                  <p className="text-gray">{faq.answer}</p>
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
            Ready to Consign Your Vehicle?
          </h2>
          <p className="text-gray-light max-w-2xl mx-auto mb-10">
            Contact us today for a free consultation. We&apos;ll discuss your vehicle,
            your goals, and how we can help you get the best price.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">Schedule Consultation</Button>
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

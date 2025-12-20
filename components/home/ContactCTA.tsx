"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Input";
import { siteConfig } from "@/lib/siteConfig";

export default function ContactCTA() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section className="py-20 bg-off-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <p className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-4">
              Get In Touch
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-charcoal font-semibold mb-6">
              Ready to Find Your
              <br />
              Perfect Vehicle?
            </h2>
            <p className="text-gray leading-relaxed mb-10">
              Whether you&apos;re looking for a specific make and model or just browsing
              our collection, we&apos;re here to help. Contact us today to schedule a
              private viewing or learn more about our inventory.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-charcoal mb-1">Location</h4>
                  <p className="text-gray text-sm">
                    {siteConfig.address.street}<br />
                    {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-charcoal mb-1">Phone</h4>
                  <a href={`tel:+1${siteConfig.phoneRaw}`} className="text-gray text-sm hover:text-gold transition-colors">
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              {siteConfig.email && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-charcoal mb-1">Email</h4>
                    <a href={`mailto:${siteConfig.email}`} className="text-gray text-sm hover:text-gold transition-colors">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-sm shadow-luxury">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl text-charcoal font-semibold mb-2">
                  Thank You!
                </h3>
                <p className="text-gray">
                  We&apos;ve received your message and will be in touch shortly.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-2xl text-charcoal font-semibold mb-6">
                  Send Us a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Name"
                      name="name"
                      placeholder="Your name"
                      required
                    />
                    <Input
                      label="Phone"
                      name="phone"
                      type="tel"
                      placeholder="(555) 555-5555"
                    />
                  </div>
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                  <Textarea
                    label="Message"
                    name="message"
                    placeholder="How can we help you?"
                    rows={4}
                    required
                  />
                  <Button type="submit" className="w-full" isLoading={isSubmitting}>
                    Send Message
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

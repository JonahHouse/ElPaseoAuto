"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
          type: "general",
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl text-charcoal font-semibold mb-2">
          Message Sent!
        </h3>
        <p className="text-gray">
          Thank you for reaching out. We&apos;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
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
          rows={5}
          required
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Send Message
        </Button>
      </form>
    </>
  );
}

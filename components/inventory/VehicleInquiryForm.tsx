"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Input";
import { siteConfig } from "@/lib/siteConfig";
import { isValidEmail, isValidPhone } from "@/lib/validation";

interface VehicleInquiryFormProps {
  vehicleTitle: string;
  vehicleId: number;
}

interface FieldErrors {
  email?: string;
  phone?: string;
}

export default function VehicleInquiryForm({
  vehicleTitle,
  vehicleId,
}: VehicleInquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    if (name === "email") {
      if (!value) return "Email is required";
      if (!isValidEmail(value)) return "Please enter a valid email address";
    }
    if (name === "phone" && value && !isValidPhone(value)) {
      return "Please enter a valid phone number";
    }
    return undefined;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    // Validate all fields
    const emailError = validateField("email", email);
    const phoneError = validateField("phone", phone);

    if (emailError || phoneError) {
      setErrors({ email: emailError, phone: phoneError });
      setTouched({ email: true, phone: true });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email,
          phone,
          message: formData.get("message"),
          type: "vehicle_inquiry",
          vehicleId,
          vehicleTitle,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch {
      // Handle error silently for now
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-sm shadow-luxury p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="font-display text-lg text-charcoal font-semibold mb-2">
          Inquiry Sent!
        </h4>
        <p className="text-gray text-sm">
          We&apos;ll be in touch about this vehicle soon.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sm shadow-luxury p-6">
      <h3 className="font-display text-xl text-charcoal font-semibold mb-2">
        Interested in this vehicle?
      </h3>
      <p className="text-gray text-sm mb-6">
        Send us a message and we&apos;ll get back to you shortly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="vehicle" value={vehicleTitle} />
        <Input
          label="Name"
          name="name"
          placeholder="Your name"
          required
        />
        <div>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
            onBlur={handleBlur}
          />
          {touched.email && errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        <div>
          <Input
            label="Phone"
            name="phone"
            type="tel"
            placeholder="(555) 555-5555"
            onBlur={handleBlur}
          />
          {touched.phone && errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
        <Textarea
          label="Message"
          name="message"
          placeholder={`I'm interested in the ${vehicleTitle}...`}
          rows={3}
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Send Inquiry
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-light/20">
        <p className="text-center text-gray text-sm mb-3">Or call us directly</p>
        <a
          href={`tel:+1${siteConfig.phoneRaw}`}
          className="flex items-center justify-center gap-2 text-gold hover:text-gold-dark font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {siteConfig.phone}
        </a>
      </div>
    </div>
  );
}

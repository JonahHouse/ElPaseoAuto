"use client";

import { useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

export default function MobileNav({ isOpen, onClose, links }: MobileNavProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 z-50
          transition-opacity duration-300
          lg:hidden
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
      />

      {/* Slide-out Menu */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 w-80 max-w-full
          bg-charcoal z-50
          transition-transform duration-300 ease-out
          lg:hidden
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Close Button */}
        <div className="flex justify-end p-6">
          <button
            onClick={onClose}
            className="text-white hover:text-gold transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-6">
          <ul className="space-y-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="
                    block text-xl font-display text-white
                    hover:text-gold transition-colors
                  "
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Link href="/contact" onClick={onClose}>
              <Button className="w-full">
                Schedule Visit
              </Button>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-gray-dark">
            <p className="text-gray-light text-sm mb-4">Contact Us</p>
            <a
              href={`tel:+1${siteConfig.phoneRaw}`}
              className="block text-white hover:text-gold transition-colors mb-2"
            >
              {siteConfig.phone}
            </a>
            {siteConfig.email && (
              <a
                href={`mailto:${siteConfig.email}`}
                className="block text-white hover:text-gold transition-colors"
              >
                {siteConfig.email}
              </a>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}

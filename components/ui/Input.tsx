"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-charcoal mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3
            bg-white border border-gray-light/30
            rounded-sm
            text-charcoal placeholder-gray-light
            transition-luxury
            focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold
            disabled:bg-off-white disabled:cursor-not-allowed
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
  }
>(({ className = "", label, error, id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-charcoal mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={`
          w-full px-4 py-3
          bg-white border border-gray-light/30
          rounded-sm
          text-charcoal placeholder-gray-light
          transition-luxury
          focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold
          disabled:bg-off-white disabled:cursor-not-allowed
          resize-none
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
  }
>(({ className = "", label, error, id, children, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-charcoal mb-2"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={`
          w-full px-4 py-3
          bg-white border border-gray-light/30
          rounded-sm
          text-charcoal
          transition-luxury
          focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold
          disabled:bg-off-white disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Select.displayName = "Select";

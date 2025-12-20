"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push(from);
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Invalid password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-luxury p-8">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl text-charcoal font-semibold mb-2">
          Admin Login
        </h1>
        <p className="text-gray text-sm">
          Enter your password to access the admin panel
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          error={error}
          autoFocus
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-light/20 text-center">
        <a
          href="/"
          className="text-sm text-gray hover:text-gold transition-colors"
        >
          ← Back to website
        </a>
      </div>
    </div>
  );
}

function LoginFormFallback() {
  return (
    <div className="bg-white rounded-sm shadow-luxury p-8 animate-pulse">
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-light/20 rounded w-32 mx-auto mb-2" />
        <div className="h-4 bg-gray-light/20 rounded w-48 mx-auto" />
      </div>
      <div className="space-y-6">
        <div className="h-12 bg-gray-light/20 rounded" />
        <div className="h-12 bg-gray-light/20 rounded" />
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

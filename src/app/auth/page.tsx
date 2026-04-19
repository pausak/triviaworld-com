"use client";

import { Suspense, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-12" />}>
      <AuthForm />
    </Suspense>
  );
}

function AuthForm() {
  const searchParams = useSearchParams();
  const initialIsLogin = searchParams.get("mode") !== "signup";
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, nickname || undefined);
      }
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--card-border)]">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1">Nickname</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--secondary)] border border-[var(--card-border)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                placeholder="Your display name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--secondary)] border border-[var(--card-border)] focus:border-[var(--primary)] focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--secondary)] border border-[var(--card-border)] focus:border-[var(--primary)] focus:outline-none transition-colors"
              placeholder="Min 6 characters"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
          >
            {loading
              ? "..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-sm text-[var(--primary)] hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

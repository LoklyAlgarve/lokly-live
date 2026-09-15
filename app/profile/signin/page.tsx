"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import { createClient } from "../../../utils/supabase/client";
import { useLanguage } from "../../LanguageContext";

export default function SignInPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-48">
      <Header />

      <section className="mx-auto max-w-xl px-5 py-8 sm:px-6">
        <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
          {t("Sign in to Lokly")}
        </h1>

        <p className="mt-2 text-slate-500">
          {t("Sign in to save your favourite events.")}
        </p>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-slate-700"
              >
                {t("Email address")}
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("you@example.com")}
                autoComplete="email"
                required
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-slate-700"
                >
                  {t("Password")}
                </label>

                <a
                  href="/profile/forgot-password"
                  className="text-sm font-bold text-[#149EAF] hover:underline"
                >
                  {t("Forgot password?")}
                </a>
              </div>

              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t("Your password")}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 pr-12 text-base text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? t("Hide password") : t("Show password")
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18M10.58 10.58a2 2 0 102.83 2.83M9.88 4.24A10.45 10.45 0 0112 4c5.23 0 9.38 3.5 10.5 8a10.7 10.7 0 01-4.02 5.52M6.23 6.23C4.57 7.35 3.34 9.04 1.5 12c1.12 4.5 5.27 8 10.5 8a10.45 10.45 0 004.12-.84"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.06 12.35a1 1 0 010-.7C3.64 7.56 7.5 4 12 4s8.36 3.56 9.94 7.65a1 1 0 010 .7C20.36 16.44 16.5 20 12 20s-8.36-3.56-9.94-7.65z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#149EAF] px-5 py-4 font-bold text-white shadow-sm transition hover:bg-[#117F8E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? t("Signing in...") : t("Sign In")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              {t("Don't have a Lokly account?")}{" "}
              <a
                href="/profile/signup"
                className="font-bold text-[#149EAF] hover:underline"
              >
                {t("Create Account")}
              </a>
            </p>
          </div>
        </div>
      </section>

      <BottomNavigation />
    </main>
  );
}
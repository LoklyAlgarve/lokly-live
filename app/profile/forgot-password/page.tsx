"use client";

import { FormEvent, useState } from "react";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import { createClient } from "../../../utils/supabase/client";
import { useLanguage } from "../../LanguageContext";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    const supabase = createClient();

    const redirectTo = `${window.location.origin}/auth/callback?next=/profile/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      t(
        "If an account exists for that email address, we've sent you a password reset link."
      )
    );

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-48">
      <Header />

      <section className="mx-auto max-w-xl px-5 py-8 sm:px-6">
        <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
          {t("Reset your password")}
        </h1>

        <p className="mt-2 text-slate-500">
          {t(
            "Enter your email address and we'll send you a link to reset your password."
          )}
        </p>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {error && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#149EAF] px-5 py-4 font-bold text-white shadow-sm transition hover:bg-[#117F8E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? t("Sending...") : t("Send reset link")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/profile/signin"
              className="font-bold text-[#149EAF] hover:underline"
            >
              {t("Back to Sign In")}
            </a>
          </div>
        </div>
      </section>

      <BottomNavigation />
    </main>
  );
}
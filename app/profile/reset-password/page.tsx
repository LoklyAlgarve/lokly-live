"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import { createClient } from "../../../utils/supabase/client";
import { useLanguage } from "../../LanguageContext";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setReady(true);
      }
    });

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setReady(true);
      }
    }

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError(t("Your password must be at least 6 characters."));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("The passwords do not match."));
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(t("Your password has been updated successfully."));

    setTimeout(() => {
      router.push("/profile");
      router.refresh();
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-48">
      <Header />

      <section className="mx-auto max-w-xl px-5 py-8 sm:px-6">
        <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
          {t("Create a new password")}
        </h1>

        <p className="mt-2 text-slate-500">
          {t("Choose a new password for your Lokly account.")}
        </p>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
          {!ready ? (
            <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
              {t(
                "Your password reset link is not active. Please use the latest reset email sent to you."
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-slate-700"
                >
                  {t("New password")}
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t("Enter your new password")}
                  autoComplete="new-password"
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-bold text-slate-700"
                >
                  {t("Confirm new password")}
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder={t("Enter your new password again")}
                  autoComplete="new-password"
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
                {loading
                  ? t("Updating password...")
                  : t("Update password")}
              </button>
            </form>
          )}

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
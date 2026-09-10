"use client";

import { useState } from "react";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import { createClient } from "../../../utils/supabase/client";
import { useLanguage } from "../../LanguageContext";

export default function SignUpPage() {
  const { t } = useLanguage();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setSuccess(true);
    setResendMessage("");
  }

  async function handleResendEmail() {
    setResending(true);
    setResendMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    setResending(false);

    if (error) {
      setResendMessage(error.message);
      return;
    }

    setResendMessage(
      t("Confirmation email sent. Please check your inbox.")
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-48">
      <Header />

      <section className="mx-auto max-w-lg px-5 pt-6 pb-8 sm:px-6 sm:pt-8 sm:pb-8">
        {!success ? (
          <>
            <h1 className="text-2xl font-black leading-tight text-slate-900 sm:text-4xl">
              {t("Create your Lokly account")}
            </h1>

            <p className="mt-2 text-base text-slate-500 sm:text-lg">
              {t("Create an account to save your favourite events.")}
            </p>

            <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    {t("First name")}
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="h-14 w-full rounded-2xl border border-slate-300 px-4 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
                    placeholder={t("First name")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    {t("Last name")}
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="h-14 w-full rounded-2xl border border-slate-300 px-4 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
                    placeholder={t("Last name")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    {t("Email address")}
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-14 w-full rounded-2xl border border-slate-300 px-4 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
                    placeholder={t("you@example.com")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    {t("Password")}
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-14 w-full rounded-2xl border border-slate-300 px-4 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
                    placeholder={t("At least 8 characters")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`min-h-14 w-full rounded-2xl px-5 font-bold text-white shadow-sm transition ${
                    loading
                      ? "cursor-not-allowed bg-slate-400"
                      : "bg-[#149EAF] hover:bg-[#117F8E] active:scale-[0.99]"
                  }`}
                >
                  {loading
                    ? t("Creating Account...")
                    : t("Create Account")}
                </button>
              </form>

              {message && (
                <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                  {message}
                </div>
              )}

              <p className="mt-6 text-center text-sm text-slate-500">
                {t("Already have an account?")}{" "}
                <a
                  href="/profile"
                  className="font-bold text-[#149EAF] hover:underline"
                >
                  {t("Sign in")}
                </a>
              </p>
            </div>
          </>
        ) : (
          <div className="mt-6 rounded-3xl bg-white px-6 py-10 text-center shadow-sm ring-1 ring-slate-100 sm:mt-8 sm:px-8 sm:py-12">
            {/* Success icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#149EAF]/10">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#149EAF]">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12.5L9.2 16.5L19 7.5"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <h1 className="mt-7 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
              {t("Account created!")}
            </h1>

            <p className="mt-3 text-base leading-7 text-slate-500">
              {t("We've sent a confirmation email to:")}
            </p>

            <p className="mt-2 break-all text-base font-bold text-slate-900">
              {email}
            </p>

            <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-slate-500">
              {t(
                "Please check your inbox and click the confirmation link to finish setting up your account."
              )}
            </p>

            <div className="mt-8">
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={resending}
                className={`min-h-14 w-full rounded-2xl border-2 px-5 font-bold transition ${
                  resending
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                    : "border-[#149EAF] bg-white text-[#149EAF] hover:bg-[#149EAF]/5 active:scale-[0.99]"
                }`}
              >
                {resending
                  ? t("Sending...")
                  : t("Resend confirmation email")}
              </button>
            </div>

            {resendMessage && (
              <div
                className={`mt-4 rounded-2xl p-4 text-sm ${
                  resendMessage.includes("sent")
                    ? "bg-[#149EAF]/10 text-[#117F8E]"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {resendMessage}
              </div>
            )}

            <a
              href="/profile"
              className="mt-6 flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#149EAF] px-5 font-bold text-white shadow-sm transition hover:bg-[#117F8E] active:scale-[0.99]"
            >
              {t("Already confirmed? Sign in")}
            </a>

            <p className="mt-6 text-xs leading-5 text-slate-400">
              {t(
                "If you don't see the email, check your spam or junk folder."
              )}
            </p>
          </div>
        )}
      </section>

      <BottomNavigation />
    </main>
  );
}
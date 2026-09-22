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
  const [residentStatus, setResidentStatus] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    if (password !== confirmPassword) {
      setMessage(t("Passwords do not match."));
      return;
    }

    if (!residentStatus) {
      setMessage(
        t("Please select whether you are a Portuguese resident or a visitor.")
      );
      return;
    }

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
          resident_status: residentStatus,
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
                    htmlFor="residentStatus"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    {t("Are you a Portuguese resident or a visitor?")}
                  </label>

                  <p className="mb-3 text-sm leading-5 text-slate-500">
                    {t(
                      "We ask so we can understand our Lokly community and provide useful insights to local venues. Your personal details are never shared."
                    )}
                  </p>

                  <select
                    id="residentStatus"
                    name="residentStatus"
                    required
                    value={residentStatus}
                    onChange={(event) => setResidentStatus(event.target.value)}
                    className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
                  >
                    <option value="">
                      {t("Please select")}
                    </option>
                    <option value="Portuguese resident">
                      {t("Portuguese resident")}
                    </option>
                    <option value="Visitor">
                      {t("Visitor")}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    {t("Password")}
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-14 w-full rounded-2xl border border-slate-300 px-12 pl-4 pr-12 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
                      placeholder={t("At least 8 characters")}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-[#149EAF]"
                      aria-label={
                        showPassword
                          ? t("Hide password")
                          : t("Show password")
                      }
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3l18 18M10.58 10.58A2 2 0 0113.42 13.42M9.88 4.24A9.77 9.77 0 0112 4c5.05 0 8.27 4.4 9.5 8a13.6 13.6 0 01-2.05 3.73M6.61 6.61C4.72 7.89 3.43 9.77 2.5 12c1.23 3.6 4.45 8 9.5 8a9.77 9.77 0 004.12-.9"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
                          />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    {t("Confirm password")}
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      className="h-14 w-full rounded-2xl border border-slate-300 px-4 pr-12 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
                      placeholder={t("Enter your password again")}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((current) => !current)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-[#149EAF]"
                      aria-label={
                        showConfirmPassword
                          ? t("Hide password")
                          : t("Show password")
                      }
                    >
                      {showConfirmPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3l18 18M10.58 10.58A2 2 0 0113.42 13.42M9.88 4.24A9.77 9.77 0 0112 4c5.05 0 8.27 4.4 9.5 8a13.6 13.6 0 01-2.05 3.73M6.61 6.61C4.72 7.89 3.43 9.77 2.5 12c1.23 3.6 4.45 8 9.5 8a9.77 9.77 0 004.12-.9"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
                          />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
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

            {/* Home screen tip */}
            <div className="mt-8 rounded-3xl bg-[#E4F5F7] p-5 text-left">
              <p className="text-sm font-bold uppercase tracking-wide text-[#149EAF]">
                {t("A little Lokly tip")}
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-900">
                {t("Want Lokly as an app?")}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {t(
                  "Add Lokly to your home screen for quick, one-tap access to everything happening in the Algarve."
                )}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {t(
                  "Open the 'Menu' and tap Lokly App for simple instructions."
                )}
              </p>
            </div>

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
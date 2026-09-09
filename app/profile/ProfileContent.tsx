"use client";

import { useLanguage } from "../LanguageContext";
import LocationDisplay from "./LocationDisplay";

export default function ProfileContent({
  fullName,
  isSignedIn,
  email,
  handleSignOut,
}: {
  fullName: string;
  isSignedIn: boolean;
  email?: string;
  handleSignOut: () => Promise<void>;
}) {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-4xl px-5 py-8 sm:px-6">
      <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
        {t("My Profile")}
      </h1>

      <p className="mt-2 text-slate-500">
        {t("Manage your Lokly account and preferences.")}
      </p>

      <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#149EAF] text-4xl text-white shadow-sm">
              👤
            </div>

            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-slate-900">
                {fullName}
              </h2>

              {isSignedIn ? (
                <p className="mt-1 break-all text-slate-500">
                  {email}
                </p>
              ) : (
                <p className="mt-1 text-slate-500">
                  {t("Sign in to save your favourite events.")}
                </p>
              )}
            </div>
          </div>

          {!isSignedIn && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a
                href="/profile/signin"
                className="flex min-h-14 items-center justify-center rounded-2xl bg-[#149EAF] px-5 font-bold text-white shadow-sm transition hover:bg-[#117F8E] active:scale-[0.99]"
              >
                {t("Sign In")}
              </a>

              <a
                href="/profile/signup"
                className="flex min-h-14 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
              >
                {t("Create Account")}
              </a>
            </div>
          )}

          {isSignedIn && (
            <div className="mt-8">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-700">
                  {t("You're signed in")}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {t(
                    "Your favourite events can now be saved to your account."
                  )}
                </p>
              </div>

              <form action={handleSignOut} className="mt-4">
                <button
                  type="submit"
                  className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-5 font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
                >
                  {t("Sign Out")}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100">
          <div className="px-6 py-4 sm:px-8">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
              {t("Preferences")}
            </h3>
          </div>

          <a
            href="/profile/notifications"
            className="flex min-h-16 w-full items-center justify-between border-t border-slate-100 px-6 text-left transition hover:bg-slate-50 sm:px-8"
          >
            <div>
              <p className="font-semibold text-slate-900">
                {t("Notifications")}
              </p>

              <p className="text-sm text-slate-500">
                {t("Manage event notifications")}
              </p>
            </div>

            <span className="text-xl text-slate-400">
              ›
            </span>
          </a>

          <a
            href="/profile/location"
            className="flex min-h-16 w-full items-center justify-between border-t border-slate-100 px-6 text-left transition hover:bg-slate-50 sm:px-8"
          >
            <div>
              <p className="font-semibold text-slate-900">
                {t("Location")}
              </p>

              <p className="text-sm text-slate-500">
                <LocationDisplay />
              </p>
            </div>

            <span className="text-xl text-slate-400">
              ›
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import { useLanguage } from "../../LanguageContext";

export default function NotificationsPage() {
  const { t } = useLanguage();

  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("lokly-notifications");

    if (saved !== null) {
      setNotifications(saved === "true");
    }
  }, []);

  function toggleNotifications() {
    const newValue = !notifications;

    setNotifications(newValue);

    localStorage.setItem(
      "lokly-notifications",
      String(newValue)
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-48">
      <Header />

      <section className="mx-auto max-w-2xl px-5 py-8 sm:px-6">

        <a
          href="/profile"
          className="text-sm font-bold text-[#149EAF] hover:underline"
        >
          {t("← Back to Profile")}
        </a>

        <h1 className="mt-5 text-[28px] font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
          {t("Notifications")}
        </h1>

        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          {t(
            "Choose which Lokly notifications you'd like to receive."
          )}
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">

          <div className="flex items-center justify-between gap-5 p-6 sm:p-8">

            <div>
              <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                {t("Event Notifications")}
              </h2>

              <p className="mt-2 text-base leading-relaxed text-slate-600 sm:text-lg">
                {t(
                  "Get notified about events and new things happening around the Algarve."
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleNotifications}
              aria-label={
                notifications
                  ? t("Turn notifications off")
                  : t("Turn notifications on")
              }
              className={`relative h-8 w-14 shrink-0 rounded-full transition ${
                notifications
                  ? "bg-[#149EAF]"
                  : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition ${
                  notifications
                    ? "left-7"
                    : "left-1"
                }`}
              />
            </button>

          </div>

          <div className="border-t border-slate-100 px-6 py-5 sm:px-8">

            <p className="text-base font-bold text-slate-700 sm:text-lg">
              {notifications
                ? t("Notifications are ON")
                : t("Notifications are OFF")}
            </p>

            <p className="mt-2 text-base leading-relaxed text-slate-500">
              {t("You can change this setting at any time.")}
            </p>

          </div>

        </div>

      </section>

      <BottomNavigation />
    </main>
  );
}
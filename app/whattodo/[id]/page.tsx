
"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import { createClient } from "../../../utils/supabase/client";
import { useLanguage } from "../../LanguageContext";

type WhatToDo = {
  id: number;
  title: string;
  location: string;
  date?: string;
  time?: string;
  end_date?: string;
  end_time?: string;
  category: string;
  price?: string;
  image: string;
  description?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  business_name?: string;
  contact_phone?: string;
  additional_comments?: string;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getImageUrl(image: string) {
  if (!image) {
    return "/images/lokly-logo.png";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("/")
  ) {
    return image;
  }

  return `/${image}`;
}

function formatTime(time?: string) {
  if (!time) return "";

  const [hoursString, minutesString] = time.split(":");
  const hours = Number(hoursString);
  const minutes = Number(minutesString);

  if (Number.isNaN(hours)) return time;

  const suffix = hours >= 12 ? "pm" : "am";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${String(minutes || 0).padStart(2, "0")}${suffix}`;
}

function formatDate(date?: string) {
  if (!date) return "";

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/*
 * WHEN comes ONLY from the actual date/time fields in the database.
 * additional_comments is deliberately NOT used here.
 */
function getWhenText(item: WhatToDo) {
  const dateText = formatDate(item.date);
  const endDateText = formatDate(item.end_date);
  const startTime = formatTime(item.time);
  const endTime = formatTime(item.end_time);

  let datePart = "";

  if (dateText && endDateText && dateText !== endDateText) {
    datePart = `${dateText} – ${endDateText}`;
  } else if (dateText) {
    datePart = dateText;
  }

  let timePart = "";

  if (startTime && endTime) {
    timePart = `${startTime} – ${endTime}`;
  } else if (startTime) {
    timePart = startTime;
  }

  if (datePart && timePart) {
    return `${datePart} • ${timePart}`;
  }

  if (datePart) {
    return datePart;
  }

  if (timePart) {
    return timePart;
  }

  return "";
}

export default function WhatToDoDetailPage({
  params,
}: PageProps) {
  const { id } = use(params);
  const { language } = useLanguage();

  const [item, setItem] = useState<WhatToDo | null>(null);
  const [loading, setLoading] = useState(true);

  const [eventLanguage, setEventLanguage] = useState<string | null>(null);
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
  const [translatedDescription, setTranslatedDescription] = useState<string | null>(null);
  const [translationLoading, setTranslationLoading] = useState(false);
  const [translationError, setTranslationError] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    async function loadItem() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("what_to_do")
        .select("*")
        .eq("id", Number(id))
        .eq("approved", true)
        .maybeSingle();

      if (error) {
        console.error(
          "Lokly: Could not load What to do item",
          error
        );
        setItem(null);
      } else {
        setItem(data);
      }

      setLoading(false);
    }

    loadItem();
  }, [id]);

  /*
   * Detect the content language using the existing
   * /api/translate-event API.
   */
  useEffect(() => {
    if (!item) {
      return;
    }

    const currentItem = item;

    async function detectLanguage() {
      setTranslationLoading(true);
      setTranslationError(false);
      setEventLanguage(null);
      setShowTranslation(false);
      setTranslatedTitle(null);
      setTranslatedDescription(null);

      try {
        const response = await fetch(
          "/api/translate-event",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "detect",
              title: currentItem.title,
              description: currentItem.description || "",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Language detection failed");
        }

        const data = await response.json();

        const detectedLanguage = String(
          data?.sourceLanguage || "Other"
        ).trim();

        if (
          detectedLanguage === "English" ||
          detectedLanguage === "Portuguese"
        ) {
          setEventLanguage(detectedLanguage);
        } else {
          setEventLanguage("Other");
        }
      } catch (error) {
        console.error(
          "Lokly: Translation detection failed",
          error
        );

        setTranslationError(false);
        setEventLanguage(null);
      } finally {
        setTranslationLoading(false);
      }
    }

    detectLanguage();
  }, [item]);

  async function handleTranslate() {
    if (!item) {
      return;
    }

    if (showTranslation) {
      setShowTranslation(false);
      return;
    }

    setTranslationLoading(true);
    setTranslationError(false);

    try {
      const targetLanguage =
        eventLanguage === "Portuguese"
          ? "English"
          : eventLanguage === "English"
            ? "Portuguese"
            : language === "pt"
              ? "English"
              : "Portuguese";

      const response = await fetch(
        "/api/translate-event",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "translate",
            title: item.title,
            description: item.description || "",
            targetLanguage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Translation request failed"
        );
      }

      if (
        data?.sourceLanguage === "English" ||
        data?.sourceLanguage === "Portuguese"
      ) {
        setEventLanguage(data.sourceLanguage);
      }

      setTranslatedTitle(data.translatedTitle ?? item.title);
      setTranslatedDescription(
        data.translatedDescription ?? item.description ?? ""
      );

      setShowTranslation(true);
    } catch (error) {
      console.error("Lokly: Translation failed", error);
      setTranslationError(true);
    } finally {
      setTranslationLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 pb-32">
        <Header />

        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="font-semibold text-slate-500">
            Loading...
          </p>
        </section>

        <BottomNavigation />
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-slate-50 pb-32">
        <Header />

        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h1 className="text-3xl font-black text-slate-900">
            What to do item not found
          </h1>

          <p className="mt-3 text-slate-500">
            We couldn't find this activity.
          </p>

          <Link
            href="/whattodo"
            className="mt-8 inline-flex rounded-2xl bg-[#1D2B5B] px-6 py-3 font-bold text-white transition hover:bg-[#152044]"
          >
            {language === "pt"
              ? "Voltar a O que fazer"
              : "Back to 'What to do'"}
          </Link>
        </section>

        <BottomNavigation />
      </main>
    );
  }

  const isPortuguese = language === "pt";

  const directionsUrl =
    item.latitude && item.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`
      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          item.location
        )}`;

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://www.lokly.live/whattodo/${item.id}`;

  const whenText = getWhenText(item);

  async function handleShare() {
    if (!item) return;
    const message = `I found this on Lokly and thought you might like it!

${item.title}

📍 ${item.location}

Discover more local things to do:

https://www.lokly.live`;

    if (
      typeof navigator !== "undefined" &&
      navigator.share
    ) {
      try {
        await navigator.share({
          title: item.title,
          text: message,
          url: shareUrl,
        });
      } catch {
        // User cancelled sharing
      }

      return;
    }

    const whatsappUrl =
      "https://wa.me/?text=" +
      encodeURIComponent(`${message}\n\n${shareUrl}`);

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-32">
      <Header />

      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        {/* BACK */}
        <Link
          href="/whattodo"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-[#C69A22]"
        >
          <span className="text-lg">←</span>

          {isPortuguese
            ? "Voltar a O que fazer"
            : "Back to 'What to do'"}
        </Link>

        <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
          {/* IMAGE */}
          <div className="relative w-full bg-slate-100">
            <img
              src={getImageUrl(item.image)}
              alt={item.title}
              className="block h-auto w-full"
            />
          </div>

          <div className="p-5 sm:p-8">
            {/* TITLE */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#C69A22]">
                  {item.category}
                </p>

                <h1 className="mt-2 text-3xl font-black leading-tight text-[#172554] sm:text-4xl">
                  {showTranslation && translatedTitle
                    ? translatedTitle
                    : item.title}
                </h1>

                {/* TRANSLATION */}
                <button
                  type="button"
                  onClick={handleTranslate}
                  disabled={translationLoading}
                  className="mt-4 inline-flex rounded-full border border-[#0EA5B7] px-5 py-2.5 font-semibold text-[#0EA5B7] transition hover:bg-[#0EA5B7]/5 disabled:opacity-60"
                >
                  {translationLoading
                    ? language === "pt"
                      ? "A traduzir..."
                      : "Translating..."
                    : showTranslation
                      ? eventLanguage === "Portuguese"
                        ? "Show original"
                        : "Mostrar original"
                      : eventLanguage === "Portuguese"
                        ? "Translate to English"
                        : "Traduzir para português"}
                </button>

                {translationError && (
                  <p className="mt-2 text-sm text-red-600">
                    {language === "pt"
                      ? "Não foi possível traduzir. Tente novamente."
                      : "Translation failed. Please try again."}
                  </p>
                )}
              </div>

              {/* SHARE */}
              <button
                type="button"
                aria-label="Share"
                title="Share"
                onClick={handleShare}
                className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-[#C69A22]/10 hover:text-[#C69A22]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"
                  />
                </svg>
              </button>
            </div>

            {/* LOCATION + WHEN */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* LOCATION */}
              <div className="flex min-w-0 items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <span className="text-lg">📍</span>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    {isPortuguese ? "Localização" : "Location"}
                  </p>

                  <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-800">
                    {item.location}
                  </p>
                </div>
              </div>

              {/* WHEN */}
              {whenText && (
                <div className="flex min-w-0 items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <span className="text-lg">🕒</span>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      {isPortuguese ? "Quando" : "When"}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {whenText}
                    </p>
                  </div>
                </div>
              )}

              {/* PRICE */}
              {item.price && (
                <div className="flex min-w-0 items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <span className="text-lg font-bold text-[#C69A22]">
                    €
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      {isPortuguese ? "Preço" : "Price"}
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                      {item.price}
                    </p>
                  </div>
                </div>
              )}

              {/* BUSINESS */}
              {item.business_name && (
                <div className="flex min-w-0 items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <span className="text-lg text-[#C69A22]">
                    ★
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      {isPortuguese
                        ? "Organizado por"
                        : "Provided by"}
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                      {item.business_name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            {item.description && (
              <div className="mt-8">
                <h2 className="text-xl font-black text-[#172554]">
                  {isPortuguese ? "Sobre" : "About this"}
                </h2>

                <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                  {showTranslation && translatedDescription
                    ? translatedDescription
                    : item.description}
                </p>
              </div>
            )}

            {/* EXTRA INFORMATION */}
            {item.additional_comments && (
              <div className="mt-6 rounded-2xl bg-[#FFF9E8] p-4">
                <p className="text-sm font-semibold leading-6 text-slate-700">
                  {item.additional_comments}
                </p>
              </div>
            )}

            {/* CONTACT */}
            {item.contact_phone && (
              <div className="mt-6">
                <h2 className="text-xl font-black text-[#172554]">
                  {isPortuguese ? "Contacto" : "Contact"}
                </h2>

                <a
                  href={`tel:${item.contact_phone.replace(
                    /\s/g,
                    ""
                  )}`}
                  className="mt-3 inline-flex font-semibold text-[#1D2B5B] underline"
                >
                  {item.contact_phone}
                </a>
              </div>
            )}

            {/* BUTTONS */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="flex flex-col gap-3">
                {/* DIRECTIONS */}
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1D2B5B] px-5 text-base font-bold text-white transition hover:bg-[#152044]"
                >
                  📍
                  {isPortuguese
                    ? "Direções"
                    : "Get Directions"}
                </a>

                {/* WEBSITE */}
                {item.website && (
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-14 w-full items-center justify-center rounded-2xl border-2 border-[#C69A22] px-5 text-base font-bold text-[#1D2B5B] transition hover:bg-[#C69A22] hover:text-white"
                  >
                    {isPortuguese
                      ? "Mais informações"
                      : "More Information"}
                  </a>
                )}
              </div>
            </div>
          </div>
        </article>
      </section>

      <BottomNavigation />
    </main>
  );
}

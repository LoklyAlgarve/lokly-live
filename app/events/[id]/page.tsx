"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import SaveButton from "../../components/SaveButton";
import { getEvents } from "../../data/events";
import { createClient } from "../../../utils/supabase/client";
import { useLanguage } from "../../LanguageContext";

type Event = {
  id: number;
  title: string;
  location: string;
  date: string;
  time: string;
  category: string;
  price: string;
  image: string;
  featured: boolean;
  description: string;
  website?: string;
  latitude: number;
  longitude: number;
  wheelchairFriendly: string;
  petFriendly: string;
  additionalImages?: string[];
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getFriendlyValue(value: string) {
  const normalised = value?.trim().toLowerCase();

  if (normalised === "yes") return "Yes";
  if (normalised === "no") return "No";

  return "Unknown";
}

function getFriendlyBadgeClass(value: string) {
  return value === "Yes"
    ? "bg-emerald-100 text-emerald-700"
    : value === "No"
      ? "bg-slate-200 text-slate-600"
      : "bg-slate-100 text-slate-500";
}

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

/*
 * Calendar system.
 * Creates a real .ics calendar file.
 */
function parseEventDateTime(
  dateValue: any,
  timeValue: any
): Date | null {
  const date = String(dateValue || "").trim();
  const time = String(timeValue || "").trim();

  if (!date) {
    return null;
  }

  let year: number;
  let month: number;
  let day: number;

  /*
   * Handle YYYY-MM-DD and ISO date strings.
   */
  const isoMatch = date.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})/
  );

  if (isoMatch) {
    year = Number(isoMatch[1]);
    month = Number(isoMatch[2]);
    day = Number(isoMatch[3]);
  } else {
    /*
     * Handle DD/MM/YYYY
     */
    const slashMatch = date.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
    );

    if (slashMatch) {
      day = Number(slashMatch[1]);
      month = Number(slashMatch[2]);
      year = Number(slashMatch[3]);
    } else {
      /*
       * Handle DD-MM-YYYY
       */
      const dashMatch = date.match(
        /^(\d{1,2})-(\d{1,2})-(\d{4})/
      );

      if (dashMatch) {
        day = Number(dashMatch[1]);
        month = Number(dashMatch[2]);
        year = Number(dashMatch[3]);
      } else {
        /*
         * Final fallback.
         */
        const parsed = new Date(date);

        if (!Number.isNaN(parsed.getTime())) {
          year = parsed.getFullYear();
          month = parsed.getMonth() + 1;
          day = parsed.getDate();
        } else {
          return null;
        }
      }
    }
  }

  if (
    !year ||
    !month ||
    !day ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  let hour = 0;
  let minute = 0;

  /*
   * Handle:
   * 19:30
   * 19:30:00
   * 7:30 PM
   * 7 PM
   */
  if (time) {
    const timeMatch = time.match(
      /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i
    );

    if (timeMatch) {
      hour = Number(timeMatch[1]);
      minute = Number(timeMatch[2] || 0);

      const meridiem = timeMatch[3]?.toUpperCase();

      if (meridiem === "PM" && hour < 12) {
        hour += 12;
      }

      if (meridiem === "AM" && hour === 12) {
        hour = 0;
      }
    } else {
      const simpleTimeMatch = time.match(
        /(\d{1,2}):(\d{2})/
      );

      if (simpleTimeMatch) {
        hour = Number(simpleTimeMatch[1]);
        minute = Number(simpleTimeMatch[2]);
      }
    }
  }

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  const result = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    0,
    0
  );

  if (Number.isNaN(result.getTime())) {
    return null;
  }

  return result;
}

function addToCalendar(event: Event) {
  const start = parseEventDateTime(
    event.date,
    event.time
  );

  if (!start) {
    console.error(
      "Lokly: Could not understand event date/time",
      {
        eventId: event.id,
        eventTitle: event.title,
        date: event.date,
        time: event.time,
      }
    );

    return;
  }

  /*
   * Events without an end time get a default
   * two-hour duration.
   */
  const end = new Date(
    start.getTime() +
      2 * 60 * 60 * 1000
  );

  function formatICSDate(value: Date) {
    const y = value.getUTCFullYear();

    const m = String(
      value.getUTCMonth() + 1
    ).padStart(2, "0");

    const d = String(
      value.getUTCDate()
    ).padStart(2, "0");

    const h = String(
      value.getUTCHours()
    ).padStart(2, "0");

    const min = String(
      value.getUTCMinutes()
    ).padStart(2, "0");

    const s = String(
      value.getUTCSeconds()
    ).padStart(2, "0");

    return `${y}${m}${d}T${h}${min}${s}Z`;
  }

  function escapeICS(value: string) {
    return String(value)
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r?\n/g, "\\n");
  }

  const calendarContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lokly//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:lokly-${event.id}-${Date.now()}@lokly.live`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:${escapeICS(
      event.title || "Lokly Event"
    )}`,
    `LOCATION:${escapeICS(
      event.location || "Algarve"
    )}`,
    `DESCRIPTION:${escapeICS(
      event.description || ""
    )}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  try {
    const blob = new Blob(
      [calendarContent],
      {
        type: "text/calendar;charset=utf-8",
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const filename =
      `${String(
        event.title || "lokly-event"
      )
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase()}.ics`;

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 5000);
  } catch (error) {
    console.error(
      "Lokly: Calendar download failed",
      error
    );
  }
}

export default function EventPage({
  params,
}: PageProps) {
  const { id } = use(params);
  const { t, language } = useLanguage();

  const [event, setEvent] =
    useState<Event | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [goingCount, setGoingCount] =
    useState(0);

  const [maybeCount, setMaybeCount] =
    useState(0);

  const [additionalImages, setAdditionalImages] =
    useState<string[]>([]);

  const [selectedPhoto, setSelectedPhoto] =
    useState<string | null>(null);

  const [eventLanguage, setEventLanguage] =
    useState<
      "English" | "Portuguese" | "Other" | null
    >(null);

  const [translatedTitle, setTranslatedTitle] =
    useState<string | null>(null);

  const [
    translatedDescription,
    setTranslatedDescription,
  ] = useState<string | null>(null);

  const [translationLoading, setTranslationLoading] =
    useState(false);

  const [translationError, setTranslationError] =
    useState(false);

  const [showTranslation, setShowTranslation] =
    useState(false);

  useEffect(() => {
    async function loadEvent() {
      const events = await getEvents();

      const foundEvent = events.find(
        (item) => item.id === Number(id)
      );

      setEvent(foundEvent || null);
      setLoading(false);
    }

    loadEvent();
  }, [id]);

  useEffect(() => {
    async function loadAdditionalImages() {
      if (!event) {
        setAdditionalImages([]);
        return;
      }

      const supabase = createClient();

      const { data, error } = await supabase
        .from("events")
        .select("additional_images")
        .eq("id", event.id)
        .maybeSingle();

      if (error) {
        console.error(
          "Lokly: Could not load additional event images",
          error
        );
        setAdditionalImages([]);
        return;
      }

      const images = Array.isArray(data?.additional_images)
        ? data.additional_images.filter(
            (image: unknown): image is string =>
              typeof image === "string" && image.trim().length > 0
          )
        : [];

      setAdditionalImages(images.slice(0, 5));
    }

    loadAdditionalImages();
  }, [event]);

  /*
   * Detect the event language using the existing
   * /api/translate-event API.
   *
   * This runs quietly in the background.
   */
  useEffect(() => {
    if (!event) {
      return;
    }

    const currentEvent = event;

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
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action: "detect",
              title: currentEvent.title,
              description:
                currentEvent.description || "",
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Language detection failed"
          );
        }

        const data =
          await response.json();

        const detectedLanguage =
          String(
            data?.sourceLanguage || "Other"
          ).trim();

        if (
          detectedLanguage === "English" ||
          detectedLanguage === "Portuguese"
        ) {
          setEventLanguage(
            detectedLanguage
          );
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
  }, [event]);

  async function handleTranslate() {
    if (!event) {
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
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action: "translate",
            title: event.title,
            description:
              event.description || "",
            targetLanguage,
          }),
        }
      );

      const data = await response.json();
      console.log("TRANSLATION RESULT:", data);

      if (!response.ok) {
        console.error(
          "Lokly: Translation API error",
          data
        );

        throw new Error(
          data?.error ||
            "Translation request failed"
        );
      }

      if (
        data?.sourceLanguage === "English" ||
        data?.sourceLanguage === "Portuguese"
      ) {
        setEventLanguage(
          data.sourceLanguage
        );
      }

      setTranslatedTitle(
        data.translatedTitle ??
          event.title
      );

      setTranslatedDescription(
        data.translatedDescription ??
          event.description ??
          ""
      );

      setShowTranslation(true);
    } catch (error) {
      console.error(
        "Lokly: Translation failed",
        error
      );

      setTranslationError(true);
    } finally {
      setTranslationLoading(false);
    }
  }

  function handleShowOriginal() {
    setShowTranslation(false);
  }

  async function handleShare() {
    if (!event) {
      return;
    }

    const eventUrl =
      `https://www.lokly.live/events/${event.id}`;

    const message = `I found this event on Lokly and thought you might like it!

${event.title}

Date: ${event.date}${event.time ? ` • ${event.time}` : ""}
Location: ${event.location}

↗ View the event on Lokly:
${eventUrl}

Don't have Lokly yet?
Discover what's happening near you:
https://www.lokly.live`;

    if (
      typeof navigator !== "undefined" &&
      navigator.share
    ) {
      try {
        await navigator.share({
          title: event.title,
          text: message,
        });
      } catch {
        // User cancelled the share menu
      }

      return;
    }

    const whatsappUrl =
      "https://wa.me/?text=" +
      encodeURIComponent(message);

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  useEffect(() => {
    async function recordEventView() {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("event_views")
        .insert({
          event_id: Number(id),
          user_id: user?.id ?? null,
        });

      if (error) {
        console.error(
          "Lokly: Could not record event view",
          error
        );
      }
    }

    if (id) {
      recordEventView();
    }
  }, [id]);

  useEffect(() => {
    async function loadGoingCounts() {
      const supabase =
        createClient();

      const { data, error } =
        await supabase
          .from("saved_events")
          .select("going_status")
          .eq(
            "event_id",
            Number(id)
          );

      if (error) {
        console.error(
          "Lokly: Could not load going counts",
          error
        );

        return;
      }

      const rows = data || [];

      setGoingCount(
        rows.filter(
          (row) =>
            row.going_status ===
            "yes"
        ).length
      );

      setMaybeCount(
        rows.filter(
          (row) =>
            row.going_status ===
            "maybe"
        ).length
      );
    }

    loadGoingCounts();
  }, [id]);

  function handleGoingStatus(
    status: "yes" | "maybe" | null
  ) {
    if (status === "yes") {
      setGoingCount(
        (current) =>
          current + 1
      );

      if (maybeCount > 0) {
        setMaybeCount(
          (current) =>
            current - 1
        );
      }
    }

    if (status === "maybe") {
      setMaybeCount(
        (current) =>
          current + 1
      );

      if (goingCount > 0) {
        setGoingCount(
          (current) =>
            current - 1
        );
      }
    }

    if (status === null) {
      if (goingCount > 0) {
        setGoingCount(
          (current) =>
            current - 1
        );
      } else if (maybeCount > 0) {
        setMaybeCount(
          (current) =>
            current - 1
        );
      }
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 pb-32">
        <Header />

        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="font-semibold text-slate-500">
            {t("Loading event...")}
          </p>
        </section>

        <BottomNavigation />
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-50 pb-32">
        <Header />

        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h1 className="text-3xl font-black text-slate-900">
            {t("Event not found")}
          </h1>

          <p className="mt-3 text-slate-500">
            {t(
              "We couldn't find this event."
            )}
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-2xl bg-[#149EAF] px-6 py-3 font-bold text-white transition hover:bg-[#117F8E]"
          >
            {t("Back to Events")}
          </Link>
        </section>

        <BottomNavigation />
      </main>
    );
  }

  const directionsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      event.location
    )}`;

  const wheelchairFriendly =
    getFriendlyValue(
      event.wheelchairFriendly
    );

  const petFriendly =
    getFriendlyValue(
      event.petFriendly
    );

  /*
   * Always offer translation for an existing event.
   * Language detection is helpful for choosing the button text,
   * but it must never prevent the translation button from appearing.
   */
  const translatedVersionAvailable = Boolean(event);

  const displayedTitle =
    showTranslation &&
    translatedTitle
      ? translatedTitle
      : event.title;

  const displayedDescription =
    showTranslation &&
    translatedDescription !== null
      ? translatedDescription
      : event.description;

  /*
   * Categories are already stored in English,
   * so only translate them when the original
   * event language is English and the user wants
   * Portuguese.
   */
  const translatedCategoryMap: Record<
    string,
    string
  > = {
    Music: "Música",
    "Food & Drink": "Comida e Bebida",
    "Arts & Culture": "Artes e Cultura",
    Wellbeing: "Bem-estar",
    Family: "Família",
    "Markets & Shopping":
      "Mercados e Compras",
    Sport: "Desporto",
    Festivals: "Festivais",
    Exhibitions: "Exposições",
    Workshops: "Workshops",
  };

  const displayedCategory =
    showTranslation
      ? eventLanguage === "English"
        ? translatedCategoryMap[
            event.category
          ] || event.category
        : event.category
      : t(event.category);

  const displayedPrice =
    showTranslation
      ? eventLanguage === "English"
        ? event.price?.trim().toLowerCase() ===
          "free"
          ? "Grátis"
          : event.price?.trim().toLowerCase() ===
              "paid"
            ? "Pago"
            : event.price
        : event.price
      : t(event.price);

  function detailText(
    english: string,
    portuguese: string
  ) {
    if (
      showTranslation &&
      eventLanguage === "English"
    ) {
      return portuguese;
    }

    if (
      showTranslation &&
      eventLanguage === "Portuguese"
    ) {
      return english;
    }

    return t(english);
  }

  const displayedWheelchair =
    showTranslation
      ? eventLanguage === "English"
        ? wheelchairFriendly === "Yes"
          ? "Sim"
          : wheelchairFriendly === "No"
            ? "Não"
            : "Desconhecido"
        : wheelchairFriendly
      : t(wheelchairFriendly);

  const displayedPetFriendly =
    showTranslation
      ? eventLanguage === "English"
        ? petFriendly === "Yes"
          ? "Sim"
          : petFriendly === "No"
            ? "Não"
            : "Desconhecido"
        : petFriendly
      : t(petFriendly);

  const displayedCalendarEvent: Event = {
    ...event,
    title: displayedTitle,
    description:
      displayedDescription,
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-32">
      <Header />

      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-[#149EAF]"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>

          {t("All Events")}
        </Link>

        <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="relative w-full bg-slate-100">
            <img
              src={getImageUrl(
                event.image
              )}
              alt={displayedTitle}
              className="block h-auto w-full"
            />
          </div>

          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-6">

              {/* TITLE / CATEGORY / TRANSLATION */}
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#149EAF]">
                      {displayedCategory}
                    </p>

                    <h1 className="mt-2 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
                      {displayedTitle}
                    </h1>
                  </div>

                  <button
                    type="button"
                    aria-label="Share Event"
                    title="Share Event"
                    onClick={handleShare}
                    className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-[#149EAF]/10 hover:text-[#149EAF]"
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

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {translatedVersionAvailable && (
                    <>
                      {!showTranslation && (
                        <button
                          type="button"
                          onClick={
                            handleTranslate
                          }
                          disabled={
                            translationLoading
                          }
                          className="inline-flex items-center rounded-full border border-[#149EAF] bg-white px-3 py-1.5 text-xs font-bold text-[#149EAF] transition hover:bg-[#149EAF] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {eventLanguage ===
                          "Portuguese"
                            ? "Translate to English"
                            : eventLanguage ===
                                "English"
                              ? "Traduzir para português"
                              : language === "pt"
                                ? "Traduzir para inglês"
                                : "Translate to Portuguese"}
                        </button>
                      )}

                      {showTranslation && (
                        <button
                          type="button"
                          onClick={
                            handleShowOriginal
                          }
                          className="inline-flex items-center rounded-full border border-[#149EAF] bg-white px-3 py-1.5 text-xs font-bold text-[#149EAF] transition hover:bg-[#149EAF] hover:text-white"
                        >
                          {language === "pt"
                            ? "Mostrar original"
                            : "Show original"}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* EVENT DETAILS */}
              <div className="grid grid-cols-2 gap-3">

                {/* DATE */}
                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#149EAF] sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="17"
                      rx="2"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 2v4M8 2v4M3 10h18"
                    />
                  </svg>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      {detailText(
                        "Date",
                        "Data"
                      )}
                    </p>

                    <p className="mt-1 whitespace-normal break-words text-sm font-semibold leading-snug text-slate-800 sm:text-base">
                      {event.date}
                    </p>
                  </div>
                </div>

                {/* TIME */}
                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#149EAF] sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 7v5l3 2"
                    />
                  </svg>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      {detailText(
                        "Time",
                        "Hora"
                      )}
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-800 sm:text-base">
                      {event.time ||
                        detailText(
                          "Not specified",
                          "Não especificado"
                        )}
                    </p>
                  </div>
                </div>

                {/* LOCATION */}
                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#149EAF] sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1116 0z" />
                    <circle
                      cx="12"
                      cy="10"
                      r="2.5"
                    />
                  </svg>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      {detailText(
                        "Location",
                        "Localização"
                      )}
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-800 sm:text-base">
                      {event.location}
                    </p>
                  </div>
                </div>

                {/* PRICE */}
                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-lg font-medium leading-none text-[#149EAF] sm:h-5 sm:w-5 sm:text-[22px]">
                    €
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      {detailText(
                        "Price",
                        "Preço"
                      )}
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-800 sm:text-base">
                      {displayedPrice}
                    </p>
                  </div>
                </div>

                {/* WHEELCHAIR */}
                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <div className="mt-0.5 text-[#149EAF]">
                    ♿
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      {detailText(
                        "Wheelchair Friendly",
                        "Acessível a cadeiras de rodas"
                      )}
                    </p>

                    <span
                      className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${getFriendlyBadgeClass(
                        wheelchairFriendly
                      )}`}
                    >
                      {displayedWheelchair}
                    </span>
                  </div>
                </div>

                {/* PET FRIENDLY */}
                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <div className="mt-0.5 text-[#149EAF]">
                    🐾
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      {detailText(
                        "Pet Friendly",
                        "Animais permitidos"
                      )}
                    </p>

                    <span
                      className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${getFriendlyBadgeClass(
                        petFriendly
                      )}`}
                    >
                      {displayedPetFriendly}
                    </span>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              {displayedDescription && (
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {detailText(
                      "About this event",
                      "Sobre este evento"
                    )}
                  </h2>

                  <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                    {displayedDescription}
                  </p>
                </div>
              )}

              {/* ADDITIONAL PHOTOS */}
              {additionalImages.length > 0 && (
                <section>
                  <h2 className="text-xl font-black text-slate-900">
                    {detailText("Photos", "Fotos")}
                  </h2>

                  <div className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
                    {additionalImages.map((photo, index) => (
                      <button
                        key={`${photo}-${index}`}
                        type="button"
                        onClick={() => setSelectedPhoto(photo)}
                        className="w-[82%] shrink-0 snap-start overflow-hidden rounded-2xl bg-slate-100 text-left shadow-sm ring-1 ring-slate-100 sm:w-[300px]"
                        aria-label={`${detailText(
                          "Open photo",
                          "Abrir foto"
                        )} ${index + 1}`}
                      >
                        <img
                          src={getImageUrl(photo)}
                          alt={`${displayedTitle} ${detailText(
                            "photo",
                            "foto"
                          )} ${index + 1}`}
                          className="aspect-[4/3] h-full w-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* GOING / MAYBE */}
              <div className="flex items-center justify-center gap-5 border-t border-slate-100 pt-4">
                <div className="text-center">
                  <p className="text-xl font-black text-[#149EAF]">
                    {goingCount}
                  </p>

                  <p className="text-[11px] font-bold text-slate-500">
                    {detailText(
                      "Going",
                      "Vou"
                    )}
                  </p>
                </div>

                <div className="h-7 w-px bg-slate-200" />

                <div className="text-center">
                  <p className="text-xl font-black text-slate-500">
                    {maybeCount}
                  </p>

                  <p className="text-[11px] font-bold text-slate-500">
                    {detailText(
                      "Maybe",
                      "Talvez"
                    )}
                  </p>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex flex-col gap-3 sm:flex-row">

                  <SaveButton
                    eventId={event.id}
                    large
                    onGoingStatusChange={
                      handleGoingStatus
                    }
                  />

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#149EAF] px-5 text-base font-bold text-white transition hover:bg-[#117F8E]"
                  >
                    {detailText(
                      "Directions",
                      "Direções"
                    )}
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      addToCalendar(
                        displayedCalendarEvent
                      )
                    }
                    className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#149EAF] bg-white px-5 text-base font-bold text-[#149EAF] transition hover:bg-[#149EAF] hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="17"
                        rx="2"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 2v4M8 2v4M3 10h18"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 14h2M14 14h2M8 17h2"
                      />
                    </svg>

                    {detailText(
                      "Add to Calendar",
                      "Adicionar ao calendário"
                    )}
                  </button>

                  {event.website && (
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-14 w-full items-center justify-center rounded-2xl border-2 border-[#149EAF] px-5 text-base font-bold text-[#149EAF] transition hover:bg-[#149EAF] hover:text-white"
                    >
                      {detailText(
                        "Event Website",
                        "Site do evento"
                      )}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={detailText(
            "Photo viewer",
            "Visualizador de fotos"
          )}
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-2xl font-bold text-slate-900 shadow-lg transition hover:bg-white"
            aria-label={detailText(
              "Close photo",
              "Fechar foto"
            )}
          >
            ×
          </button>

          <img
            src={getImageUrl(selectedPhoto)}
            alt={`${displayedTitle} ${detailText(
              "photo",
              "foto"
            )}`}
            className="max-h-[92vh] max-w-[95vw] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      <BottomNavigation />
    </main>
  );
}
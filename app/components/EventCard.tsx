"use client";

import Link from "next/link";
import SaveButton from "./SaveButton";
import { useLanguage } from "../LanguageContext";

type GoingStatus = "yes" | "maybe" | null;

type EventCardProps = {
  id: number;
  title: string;
  location: string;
  date: string;
  category: string;
  image: string;
  latitude: number;
  longitude: number;

  goingStatus?: GoingStatus;
  onGoingStatusChange?: (
    eventId: number,
    status: GoingStatus
  ) => void;

  onAddToCalendar?: () => void;

  onSavedChange?: (
    eventId: number,
    saved: boolean
  ) => void;
};

function formatEventDate(date: string) {
  const [datePart, timePart] = date.split(" • ");

  // Already formatted date range, e.g.
  // 24/09/2026 - 05/10/2026
  if (datePart.includes(" - ")) {
    return timePart
      ? `${datePart} • ${timePart}`
      : datePart;
  }

  const parts = datePart.split("-");

  if (parts.length !== 3) return date;

  const [year, month, day] = parts.map(Number);

  if (!year || !month || !day) {
    return date;
  }

  const formattedDate = new Date(
    year,
    month - 1,
    day
  ).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return timePart
    ? `${formattedDate} • ${timePart}`
    : formattedDate;
}

function isToday(date: string) {
  const datePart = date.split(" • ")[0];

  // For a date range, check the first date
  const firstDate = datePart.split(" - ")[0];

  // Already formatted DD/MM/YYYY
  if (firstDate.includes("/")) {
    const [day, month, year] = firstDate
      .split("/")
      .map(Number);

    if (!day || !month || !year) return false;

    const today = new Date();

    return (
      year === today.getFullYear() &&
      month === today.getMonth() + 1 &&
      day === today.getDate()
    );
  }

  const parts = firstDate.split("-");

  if (parts.length !== 3) return false;

  const [year, month, day] = parts.map(Number);

  if (!year || !month || !day) {
    return false;
  }

  const today = new Date();

  return (
    year === today.getFullYear() &&
    month === today.getMonth() + 1 &&
    day === today.getDate()
  );
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

export default function EventCard({
  id,
  title,
  location,
  date,
  category,
  image,
  latitude,
  longitude,
  goingStatus = null,
  onGoingStatusChange,
  onAddToCalendar,
  onSavedChange,
}: EventCardProps) {
  const { t } = useLanguage();

  const directionsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  function handleStatus(status: GoingStatus) {
    if (!onGoingStatusChange) return;

    onGoingStatusChange(
      id,
      goingStatus === status ? null : status
    );
  }

  async function handleShare() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/events/${id}`
        : `/events/${id}`;

    const message = `🌟 ${title}

📅 ${formatEventDate(date)}
📍 ${location}

I found this event on Lokly and thought you might like it!

👉 View the event on Lokly:
${url}

Don't have Lokly yet?
Discover what's happening near you:
https://www.lokly.live`;

    if (
      typeof navigator !== "undefined" &&
      navigator.share
    ) {
      try {
        await navigator.share({
          title,
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

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl">

      {/* IMAGE */}
      <div className="relative shrink-0">
        <img
          src={getImageUrl(image)}
          alt={title}
          className="h-32 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-60"
        />

        {isToday(date) && (
          <div className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[9px] font-bold text-[#149EAF] shadow sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
            {t("TODAY")}
          </div>
        )}

        <SaveButton
          eventId={id}
          onSavedChange={(saved) =>
            onSavedChange?.(id, saved)
          }
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-3 sm:p-6">

        {/* CATEGORY + SHARE */}
        <div className="mb-2.5 flex min-h-[22px] items-center justify-between gap-2 sm:mb-4 sm:min-h-[28px]">

          {/* CATEGORY */}
          <div className="min-w-0">
            {category && (
              <span className="inline-block max-w-full truncate rounded-full bg-[#149EAF]/10 px-2 py-1 text-[9px] font-bold uppercase text-[#149EAF] sm:px-3 sm:text-xs">
                {t(category)}
              </span>
            )}
          </div>

          {/* SHARE */}
          <button
            type="button"
            aria-label="Share Event"
            title="Share Event"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleShare();
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-[#149EAF]/10 hover:text-[#149EAF] sm:h-9 sm:w-9"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle
                cx="18"
                cy="5"
                r="2.25"
              />
              <circle
                cx="6"
                cy="12"
                r="2.25"
              />
              <circle
                cx="18"
                cy="19"
                r="2.25"
              />
              <path d="M8 11l7.8-4.4" />
              <path d="M8 13l7.8 4.4" />
            </svg>
          </button>

        </div>

        {/* TITLE */}
        <h3 className="min-h-[40px] line-clamp-2 text-base font-bold leading-tight text-slate-900 sm:min-h-[58px] sm:text-2xl">
          {title}
        </h3>

        {/* DETAILS */}
        <div className="mt-2.5 min-h-[38px] space-y-1.5 sm:mt-4 sm:min-h-[48px]">

          {/* LOCATION */}
          <div className="flex items-start gap-1.5 text-[11px] leading-tight text-slate-600 sm:gap-2 sm:text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1116 0z"
              />
              <circle
                cx="12"
                cy="10"
                r="2.5"
              />
            </svg>

            <span className="line-clamp-1">
              {location}
            </span>
          </div>

          {/* DATE */}
          <div className="flex items-start gap-1.5 text-[11px] leading-tight text-slate-600 sm:gap-2 sm:text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-5 sm:w-5"
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

            <span className="line-clamp-1">
              {formatEventDate(date)}
            </span>
          </div>
        </div>

        {/* MAIN BUTTONS */}
        <div className="mt-auto grid grid-cols-2 gap-1.5 pt-4 sm:gap-3 sm:pt-6">

          {/* DIRECTIONS */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-lg border border-[#149EAF] py-2 text-[10px] font-bold text-[#149EAF] transition hover:bg-[#149EAF]/10 sm:rounded-xl sm:py-3 sm:text-sm"
          >
            {t("Directions")}
          </a>

          {/* DETAILS */}
          <Link
            href={`/events/${id}`}
            className="flex items-center justify-center rounded-lg bg-[#149EAF] py-2 text-[10px] font-bold text-white transition hover:bg-[#117F8E] sm:rounded-xl sm:py-3 sm:text-sm"
          >
            {t("Details")}
          </Link>
        </div>

        {/* ADD TO CALENDAR - SAVED PAGE ONLY */}
        {onAddToCalendar && (
          <button
            type="button"
            onClick={onAddToCalendar}
            className="mt-2 flex w-full items-center justify-center rounded-lg border border-[#149EAF] bg-white py-2 text-[10px] font-bold text-[#149EAF] transition hover:bg-[#149EAF]/10 sm:mt-3 sm:rounded-xl sm:py-3 sm:text-sm"
          >
            {t("Add to Calendar")}
          </button>
        )}

        {/* PLANNING */}
        {onGoingStatusChange && (
          <div className="mt-3 border-t border-slate-200 pt-3 sm:mt-4 sm:pt-4">

            <p className="text-xs font-bold text-slate-900">
              {t("Planning to go?")}
            </p>

            <div className="mt-2 grid grid-cols-2 gap-2">

              <button
                type="button"
                onClick={() => handleStatus("yes")}
                className={`rounded-lg px-2 py-2 text-xs font-bold ${
                  goingStatus === "yes"
                    ? "bg-[#149EAF] text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {t("Yes")}
              </button>

              <button
                type="button"
                onClick={() => handleStatus("maybe")}
                className={`rounded-lg px-2 py-2 text-xs font-bold ${
                  goingStatus === "maybe"
                    ? "bg-[#149EAF] text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {t("Maybe")}
              </button>

            </div>
          </div>
        )}

      </div>
    </article>
  );
}
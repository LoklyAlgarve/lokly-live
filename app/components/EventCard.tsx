"use client";

import Link from "next/link";
import SaveButton from "./SaveButton";

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
  const [datePart, timePart] =
    date.split(" • ");

  const parts = datePart.split("-");

  if (parts.length !== 3) return date;

  const [year, month, day] =
    parts.map(Number);

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
  const datePart =
    date.split(" • ")[0];

  const parts = datePart.split("-");

  if (parts.length !== 3) return false;

  const [year, month, day] =
    parts.map(Number);

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
  const directionsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  const showPlanning =
    !!onGoingStatusChange &&
    !!onAddToCalendar;

  function handleStatus(
    status: GoingStatus
  ) {
    if (!onGoingStatusChange) return;

    onGoingStatusChange(
      id,
      goingStatus === status
        ? null
        : status
    );
  }

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl">

      {/* IMAGE */}
      <div className="relative">

        <img
          src={image}
          alt={title}
          className="h-32 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-60"
        />

        {isToday(date) && (
          <div className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[9px] font-bold text-[#149EAF] shadow sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
            TODAY
          </div>
        )}

        <SaveButton
          eventId={id}
          onSavedChange={(saved) =>
            onSavedChange?.(
              id,
              saved
            )
          }
        />

      </div>

      {/* CONTENT */}
      <div className="space-y-2.5 p-3 sm:space-y-4 sm:p-6">

        {/* CATEGORY */}
        <div className="flex items-center gap-1.5">

          {category && (
            <span className="max-w-full truncate rounded-full bg-[#149EAF]/10 px-2 py-1 text-[9px] font-bold uppercase text-[#149EAF] sm:px-3 sm:text-xs">
              {category}
            </span>
          )}

        </div>

        {/* TITLE */}
        <h3 className="line-clamp-2 text-base font-bold leading-tight text-slate-900 sm:text-2xl">
          {title}
        </h3>

        {/* DETAILS */}
        <div className="space-y-1.5">

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

        {/* BUTTONS */}
        <div className="grid grid-cols-2 gap-1.5 pt-1 sm:gap-3 sm:pt-2">

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-lg border border-[#149EAF] py-2 text-[10px] font-bold text-[#149EAF] transition hover:bg-[#149EAF]/10 sm:rounded-xl sm:py-3 sm:text-sm"
          >
            Directions
          </a>

          <Link
            href={`/events/${id}`}
            className="flex items-center justify-center rounded-lg bg-[#149EAF] py-2 text-[10px] font-bold text-white transition hover:bg-[#117F8E] sm:rounded-xl sm:py-3 sm:text-sm"
          >
            Details
          </Link>

        </div>

        {showPlanning && (
          <div className="border-t border-slate-200 pt-3 sm:pt-4">

            <p className="text-xs font-bold text-slate-900">
              Planning to go?
            </p>

            <div className="mt-2 grid grid-cols-2 gap-2">

              <button
                type="button"
                onClick={() =>
                  handleStatus("yes")
                }
                className={`rounded-lg px-2 py-2 text-xs font-bold ${
                  goingStatus === "yes"
                    ? "bg-[#149EAF] text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                Yes
              </button>

              <button
                type="button"
                onClick={() =>
                  handleStatus("maybe")
                }
                className={`rounded-lg px-2 py-2 text-xs font-bold ${
                  goingStatus === "maybe"
                    ? "bg-[#149EAF] text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                Maybe
              </button>

            </div>

            <button
              type="button"
              onClick={onAddToCalendar}
              className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-2 text-xs font-bold text-slate-700"
            >
              Add to Calendar
            </button>

          </div>
        )}

      </div>

    </article>
  );
}
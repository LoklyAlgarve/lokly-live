"use client";

import Link from "next/link";
import SaveButton from "./SaveButton";

type GoingStatus = "yes" | "maybe" | null;

type EventCardProps = {
  id: number;
  title: string;
  location: string;
  date: string;
  image: string;
  latitude: number;
  longitude: number;

  // Optional Saved Events controls
  goingStatus?: GoingStatus;
  onGoingStatusChange?: (
    eventId: number,
    status: GoingStatus
  ) => void;
  onAddToCalendar?: () => void;

  // Optional save callback
  onSavedChange?: (eventId: number, saved: boolean) => void;
};

function formatEventDate(date: string) {
  const [datePart, timePart] = date.split(" • ");
  const parts = datePart.split("-");

  if (parts.length !== 3) {
    return date;
  }

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
    month: "long",
    year: "numeric",
  });

  return timePart
    ? `${formattedDate} • ${timePart}`
    : formattedDate;
}

function isToday(date: string) {
  const datePart = date.split(" • ")[0];
  const parts = datePart.split("-");

  if (parts.length !== 3) {
    return false;
  }

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

export default function EventCard({
  id,
  title,
  location,
  date,
  image,
  latitude,
  longitude,
  goingStatus = null,
  onGoingStatusChange,
  onAddToCalendar,
  onSavedChange,
}: EventCardProps) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  const showPlanning =
    !!onGoingStatusChange && !!onAddToCalendar;

  function handleStatus(status: GoingStatus) {
    if (!onGoingStatusChange) return;

    onGoingStatusChange(
      id,
      goingStatus === status ? null : status
    );
  }

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Image */}
      <div className="relative">

        <img
          src={image}
          alt={title}
          className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Today */}
        {isToday(date) && (
          <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#149EAF] shadow">
            TODAY
          </div>
        )}

        {/* Save */}
        <SaveButton
          eventId={id}
          onSavedChange={(saved) =>
            onSavedChange?.(id, saved)
          }
        />

      </div>

      {/* Content */}
      <div className="space-y-4 p-6">

        {/* Price */}
        <div className="flex items-center">
          <span className="rounded-full bg-[#149EAF]/10 px-3 py-1 text-xs font-semibold text-[#149EAF]">
            Free
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold leading-tight text-slate-900">
          {title}
        </h3>

        {/* Location + date */}
        <div className="space-y-2">

          <div className="flex items-center gap-2 text-slate-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 shrink-0 text-[#149EAF]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.243-4.243a8 8 0 1111.313 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0"
              />
            </svg>

            {location}
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 shrink-0 text-[#149EAF]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4v4m-9 0h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5v12a2 2 0 002 2z"
              />
            </svg>

            {formatEventDate(date)}
          </div>

        </div>

        {/* Directions + Details */}
        <div className="grid grid-cols-2 gap-3 pt-2">

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-xl border border-[#149EAF] py-3 font-semibold text-[#149EAF] transition hover:bg-[#149EAF]/10"
          >
            Directions
          </a>

          <Link
            href={`/events/${id}`}
            className="flex items-center justify-center rounded-xl bg-[#149EAF] py-3 font-semibold text-white transition hover:bg-[#117F8E]"
          >
            Details
          </Link>

        </div>

        {/* Saved Events planning section */}
        {showPlanning && (
          <div className="border-t border-slate-200 pt-4">

            <p className="text-sm font-bold text-slate-900">
              Planning to go?
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">

              {/* Yes */}
              <button
                type="button"
                onClick={() => handleStatus("yes")}
                className={
                  goingStatus === "yes"
                    ? "flex items-center justify-center gap-2 rounded-xl bg-[#149EAF] px-4 py-2.5 text-sm font-semibold text-white"
                    : "rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#149EAF] hover:text-[#149EAF]"
                }
              >
                Yes

                {goingStatus === "yes" && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#149EAF]">
                    ✓
                  </span>
                )}
              </button>

              {/* Maybe */}
              <button
                type="button"
                onClick={() => handleStatus("maybe")}
                className={
                  goingStatus === "maybe"
                    ? "flex items-center justify-center gap-2 rounded-xl bg-[#149EAF] px-4 py-2.5 text-sm font-semibold text-white"
                    : "rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#149EAF] hover:text-[#149EAF]"
                }
              >
                Maybe

                {goingStatus === "maybe" && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#149EAF]">
                    ✓
                  </span>
                )}
              </button>

            </div>

            {/* Calendar */}
            <button
              type="button"
              onClick={onAddToCalendar}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#149EAF] bg-white px-4 py-2.5 text-sm font-semibold text-[#149EAF] transition hover:bg-[#149EAF]/10"
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
                  d="M8 3v4m8-4v4M4 9h16M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>

              Add to Calendar
            </button>

          </div>
        )}

      </div>

    </article>
  );
}
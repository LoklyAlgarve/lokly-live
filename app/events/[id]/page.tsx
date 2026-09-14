"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import SaveButton from "../../components/SaveButton";
import { getEvents } from "../../data/events";

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

/*
 * This is the same calendar system used on Saved Events.
 * It creates a real .ics calendar file.
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

export default function EventPage({ params }: PageProps) {
  const { id } = use(params);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 pb-32">
        <Header />

        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="font-semibold text-slate-500">
            Loading event...
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
            Event not found
          </h1>

          <p className="mt-3 text-slate-500">
            We couldn't find this event.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-2xl bg-[#149EAF] px-6 py-3 font-bold text-white transition hover:bg-[#117F8E]"
          >
            Back to Events
          </Link>
        </section>

        <BottomNavigation />
      </main>
    );
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    event.location
  )}`;

  const wheelchairFriendly = getFriendlyValue(
    event.wheelchairFriendly
  );

  const petFriendly = getFriendlyValue(
    event.petFriendly
  );

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

          All Events
        </Link>

        <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="relative aspect-[16/9] w-full bg-slate-100 sm:aspect-[2/1]">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#149EAF]">
                  {event.category}
                </p>

                <h1 className="mt-2 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
                  {event.title}
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                      Date
                    </p>

                    <p className="mt-1 whitespace-normal break-words text-sm font-semibold leading-snug text-slate-800 sm:text-base">
                      {event.date}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#149EAF] sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 7v5l3 2"
                    />
                  </svg>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      Time
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-800 sm:text-base">
                      {event.time || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#149EAF] sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1116 0z"
                    />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      Location
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-800 sm:text-base">
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-lg font-medium leading-none text-[#149EAF] sm:h-5 sm:w-5 sm:text-[22px]">
                    €
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      Price
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-800 sm:text-base">
                      {event.price}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <div className="mt-0.5 text-[#149EAF]">
                    ♿
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      Wheelchair Friendly
                    </p>

                    <span
                      className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${getFriendlyBadgeClass(
                        wheelchairFriendly
                      )}`}
                    >
                      {wheelchairFriendly}
                    </span>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <div className="mt-0.5 text-[#149EAF]">
                    🐾
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      Pet Friendly
                    </p>

                    <span
                      className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${getFriendlyBadgeClass(
                        petFriendly
                      )}`}
                    >
                      {petFriendly}
                    </span>
                  </div>
                </div>
              </div>

              {event.description && (
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    About this event
                  </h2>

                  <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                    {event.description}
                  </p>
                </div>
              )}

              <div className="border-t border-slate-100 pt-6">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <SaveButton
                    eventId={event.id}
                    large
                  />

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#149EAF] px-5 text-base font-bold text-white transition hover:bg-[#117F8E]"
                  >
                    Directions
                  </a>

                  <button
                    type="button"
                    onClick={() => addToCalendar(event)}
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

                    Add to Calendar
                  </button>

                  {event.website && (
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-14 w-full items-center justify-center rounded-2xl border-2 border-[#149EAF] px-5 text-base font-bold text-[#149EAF] transition hover:bg-[#149EAF] hover:text-white"
                    >
                      Event Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <BottomNavigation />
    </main>
  );
}
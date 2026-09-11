"use client";

import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import EventCard from "../components/EventCard";
import { useEffect, useState } from "react";
import { getEvents } from "../data/events";
import { createClient } from "../../utils/supabase/client";
import { useLanguage } from "../LanguageContext";

type GoingStatus = "yes" | "maybe" | null;

export default function SavedPage() {
  const { t } = useLanguage();

  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [goingStatuses, setGoingStatuses] = useState<
    Record<number, GoingStatus>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSavedEvents() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSavedIds([]);
        setEvents([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("saved_events")
        .select("event_id")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading saved events:", error);
        setSavedIds([]);
        setEvents([]);
        setLoading(false);
        return;
      }

      const ids = (data || []).map((item) =>
        Number(item.event_id)
      );

      setSavedIds(ids);

      if (ids.length === 0) {
        loadGoingStatuses();
        setEvents([]);
        setLoading(false);
        return;
      }

      const [allEvents] = await Promise.all([
        getEvents(),
        Promise.resolve(loadGoingStatuses()),
      ]);

      setEvents(allEvents);
      setLoading(false);
    }

    function loadGoingStatuses() {
      const storedStatuses = localStorage.getItem(
        "lokly_going_statuses"
      );

      if (storedStatuses) {
        try {
          setGoingStatuses(JSON.parse(storedStatuses));
        } catch {
          setGoingStatuses({});
        }
      }
    }

    loadSavedEvents();
  }, []);

  function handleGoingStatus(
    eventId: number,
    status: GoingStatus
  ) {
    const updatedStatuses = {
      ...goingStatuses,
      [eventId]: status,
    };

    setGoingStatuses(updatedStatuses);

    localStorage.setItem(
      "lokly_going_statuses",
      JSON.stringify(updatedStatuses)
    );
  }

  function handleSavedChange(
    eventId: number,
    saved: boolean
  ) {
    if (!saved) {
      setSavedIds((currentIds) =>
        currentIds.filter((id) => id !== eventId)
      );
    }
  }

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
     * Handle YYYY-MM-DD and ISO date strings such as:
     * 2026-09-12
     * 2026-09-12T00:00:00
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
         * Handle DD-MM-YYYY as a fallback.
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
           * Final fallback for dates JavaScript understands.
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

    /*
     * Handle times such as:
     * 19:30
     * 19:30:00
     * 7:30 PM
     * 7 PM
     */
    let hour = 0;
    let minute = 0;

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
        /*
         * Try to extract a normal HH:MM time from the value.
         */
        const simpleTimeMatch = time.match(
          /(\d{1,2}):(\d{2})/
        );

        if (simpleTimeMatch) {
          hour = Number(simpleTimeMatch[1]);
          minute = Number(simpleTimeMatch[2]);
        } else {
          console.warn(
            "Lokly: Could not understand event time:",
            time
          );
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

  function addToCalendar(event: any) {
    console.log(
      "Lokly: Add to Calendar clicked",
      event
    );

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
     * Events without an end time are given a default
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

      console.log(
        "Lokly: Calendar file created successfully"
      );
    } catch (error) {
      console.error(
        "Lokly: Calendar download failed",
        error
      );
    }
  }

  const savedEvents = events.filter((event) =>
    savedIds.includes(Number(event.id))
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-36">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
          {t("Saved Events")}
        </h1>

        <p className="mt-2 text-slate-500">
          {t(
            "Your favourite events all in one place."
          )}
        </p>

        {loading ? (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">
              {t(
                "Loading your saved events..."
              )}
            </p>
          </div>
        ) : savedEvents.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">
              ♡
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              {t("No saved events yet")}
            </h2>

            <p className="mt-2 text-slate-500">
              {t(
                "Tap the heart on an event to save it here."
              )}
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {savedEvents.map((event) => {
              const status =
                goingStatuses[
                  Number(event.id)
                ] || null;

              return (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  location={event.location}
                  date={`${event.date} • ${event.time}`}
                  category={event.category}
                  image={event.image}
                  latitude={event.latitude}
                  longitude={event.longitude}
                  goingStatus={status}
                  onGoingStatusChange={
                    handleGoingStatus
                  }
                  onAddToCalendar={() =>
                    addToCalendar(event)
                  }
                  onSavedChange={
                    handleSavedChange
                  }
                />
              );
            })}
          </div>
        )}
      </section>

      <BottomNavigation />
    </main>
  );
}
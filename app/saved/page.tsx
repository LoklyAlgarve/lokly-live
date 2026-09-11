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

      const ids = (data || []).map((item) => Number(item.event_id));

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

  function addToCalendar(event: any) {
    console.log("Lokly: Add to Calendar clicked", event);

    const date = String(event.date || "").trim();
    const time = String(event.time || "00:00").trim();

    if (!date) {
      console.error("Lokly: Event has no date", event);
      return;
    }

    const cleanTime = time.replace(/[^0-9:]/g, "");

    const [year, month, day] = date
      .split("-")
      .map(Number);

    const [hour = 0, minute = 0] = cleanTime
      .split(":")
      .map(Number);

    if (
      !year ||
      !month ||
      !day ||
      Number.isNaN(hour) ||
      Number.isNaN(minute)
    ) {
      console.error("Lokly: Invalid event date/time", {
        date,
        time,
      });
      return;
    }

    const start = new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      0
    );

    const end = new Date(
      start.getTime() + 2 * 60 * 60 * 1000
    );

    function formatICSDate(value: Date) {
      const y = value.getUTCFullYear();
      const m = String(value.getUTCMonth() + 1).padStart(2, "0");
      const d = String(value.getUTCDate()).padStart(2, "0");
      const h = String(value.getUTCHours()).padStart(2, "0");
      const min = String(value.getUTCMinutes()).padStart(2, "0");
      const s = String(value.getUTCSeconds()).padStart(2, "0");

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
      `SUMMARY:${escapeICS(event.title || "Lokly Event")}`,
      `LOCATION:${escapeICS(event.location || "Algarve")}`,
      `DESCRIPTION:${escapeICS(event.description || "")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    try {
      const blob = new Blob(
        [calendarContent],
        {
          type: "text/calendar",
        }
      );

      const url = window.URL.createObjectURL(blob);

      const filename =
        `${String(event.title || "lokly-event")
          .replace(/[^a-z0-9]/gi, "-")
          .toLowerCase()}.ics`;

      const link = document.createElement("a");

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.display = "none";

      document.body.appendChild(link);

      console.log("Lokly: triggering calendar download");

      link.click();

      document.body.removeChild(link);

      // Give the browser time to start the download
      // before removing the temporary URL.
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
          {t("Your favourite events all in one place.")}
        </p>

        {loading ? (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">
              {t("Loading your saved events...")}
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
                goingStatuses[Number(event.id)] || null;

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
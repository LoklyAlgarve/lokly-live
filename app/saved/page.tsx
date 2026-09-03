"use client";

import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import EventCard from "../components/EventCard";
import { useEffect, useState } from "react";
import { getEvents } from "../data/events";
import { createClient } from "../../utils/supabase/client";

type GoingStatus = "yes" | "maybe" | null;

export default function SavedPage() {
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
        setLoading(false);
        return;
      }

      const ids = (data || []).map((item) =>
        Number(item.event_id)
      );

      setSavedIds(ids);

      const allEvents = await getEvents();
      setEvents(allEvents);

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

      setLoading(false);
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

  function addToCalendar(event: any) {
    const date = String(event.date || "").trim();
    const time = String(event.time || "00:00").trim();

    if (!date) {
      return;
    }

    const cleanTime = time.replace(/[^0-9:]/g, "");

    const [year, month, day] = date
      .split("-")
      .map(Number);

    const [hour = 0, minute = 0] = cleanTime
      .split(":")
      .map(Number);

    if (!year || !month || !day) {
      return;
    }

    const start = new Date(
      year,
      month - 1,
      day,
      hour,
      minute
    );

    const end = new Date(
      start.getTime() + 2 * 60 * 60 * 1000
    );

    function formatICSDate(value: Date) {
      const y = value.getFullYear();
      const m = String(value.getMonth() + 1).padStart(2, "0");
      const d = String(value.getDate()).padStart(2, "0");
      const h = String(value.getHours()).padStart(2, "0");
      const min = String(value.getMinutes()).padStart(2, "0");

      return `${y}${m}${d}T${h}${min}00`;
    }

    const escapeICS = (value: string) =>
      value
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");

    const location = escapeICS(
      event.location || "Algarve"
    );

    const calendarContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Lokly//Events//EN",
      "BEGIN:VEVENT",
      `UID:lokly-${event.id}-${Date.now()}@lokly`,
      `DTSTART:${formatICSDate(start)}`,
      `DTEND:${formatICSDate(end)}`,
      `SUMMARY:${escapeICS(event.title)}`,
      `LOCATION:${location}`,
      `DESCRIPTION:${escapeICS(event.description || "")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([calendarContent], {
      type: "text/calendar;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${event.title
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()}.ics`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  const savedEvents = events.filter((event) =>
    savedIds.includes(Number(event.id))
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-36">

      <Header />

      <section className="mx-auto max-w-7xl px-6 py-8">

        <h1 className="text-4xl font-black text-slate-900">
          Saved Events
        </h1>

        <p className="mt-2 text-slate-500">
          Your favourite events all in one place.
        </p>

        {loading ? (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">
              Loading your saved events...
            </p>
          </div>
        ) : savedEvents.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-sm">

            <div className="text-5xl">
              ♡
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No saved events yet
            </h2>

            <p className="mt-2 text-slate-500">
              Tap the heart on an event to save it here.
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
                  image={event.image}
                  latitude={event.latitude}
                  longitude={event.longitude}
                  goingStatus={status}
                  onGoingStatusChange={handleGoingStatus}
                  onAddToCalendar={() =>
                    addToCalendar(event)
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
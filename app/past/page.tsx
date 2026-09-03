"use client";

import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import EventCard from "../components/EventCard";
import { useEffect, useState } from "react";
import { getEvents } from "../data/events";
import { createClient } from "../../utils/supabase/client";

type FeedbackState = {
  eventId: number;
  eventTitle: string;
} | null;

export default function PastEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [feedback, setFeedback] =
    useState<FeedbackState>(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<number[]>([]);

  useEffect(() => {
    async function loadEvents() {
      const allEvents = await getEvents();
      setEvents(allEvents);
      setLoading(false);
    }

    loadEvents();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pastEvents = events.filter((event) => {
    if (!event.date) return false;

    const [year, month, day] = event.date
      .split("-")
      .map(Number);

    if (!year || !month || !day) return false;

    const eventDate = new Date(
      year,
      month - 1,
      day
    );

    eventDate.setHours(0, 0, 0, 0);

    return eventDate < today;
  });

  function openFeedback(
    eventId: number,
    eventTitle: string
  ) {
    setFeedback({
      eventId,
      eventTitle,
    });

    setRating(0);
    setComment("");
    setSubmitted([]);
  }

  function closeFeedback() {
    setFeedback(null);
    setRating(0);
    setComment("");
  }

  async function submitFeedback() {
    if (!feedback || rating === 0) {
      return;
    }

    setSubmitting(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please sign in to leave feedback.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from("event_feedback")
      .insert({
        event_id: feedback.eventId,
        event_title: feedback.eventTitle,
        rating,
        comment: comment.trim() || null,
        user_id: user.id,
      });

    if (error) {
      console.error(
        "Error submitting feedback:",
        error
      );

      alert("Sorry, we couldn't submit your feedback.");
      setSubmitting(false);
      return;
    }

    setSubmitted((current) => [
      ...current,
      feedback.eventId,
    ]);

    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-36">

      <Header />

      <section className="mx-auto max-w-7xl px-6 py-8">

        <h1 className="text-4xl font-black text-slate-900">
          Past Events
        </h1>

        <p className="mt-2 text-slate-500">
          Events you may have missed.
        </p>

        {loading ? (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">
              Loading past events...
            </p>
          </div>
        ) : pastEvents.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-sm">

            <div className="text-4xl text-slate-300">
              ◷
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No past events
            </h2>

            <p className="mt-2 text-slate-500">
              Past events will appear here automatically.
            </p>

          </div>
        ) : (
          <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">

            {pastEvents.map((event) => {

              const alreadySubmitted =
                submitted.includes(Number(event.id));

              return (
                <div
                  key={event.id}
                  className="relative"
                >

                  <div className="absolute left-4 top-4 z-10 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
                    Past Event
                  </div>

                  <EventCard
                    id={event.id}
                    title={event.title}
                    location={event.location}
                    date={`${event.date} • ${event.time}`}
                    image={event.image}
                    latitude={event.latitude}
                    longitude={event.longitude}
                  />

                  {alreadySubmitted ? (
                    <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-500">
                      Thank you for your feedback
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        openFeedback(
                          Number(event.id),
                          event.title
                        )
                      }
                      className="mt-3 flex w-full items-center justify-center rounded-xl border border-[#149EAF] bg-white px-4 py-3 font-semibold text-[#149EAF] transition hover:bg-[#149EAF]/10"
                    >
                      Give Feedback
                    </button>
                  )}

                  {feedback?.eventId ===
                    Number(event.id) && (
                    <div className="mt-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

                      {submitted.includes(
                        Number(event.id)
                      ) ? (
                        <div className="text-center">

                          <h3 className="font-bold text-slate-900">
                            Thank you!
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Your feedback has been submitted.
                          </p>

                          <button
                            type="button"
                            onClick={closeFeedback}
                            className="mt-4 text-sm font-semibold text-[#149EAF]"
                          >
                            Close
                          </button>

                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">

                            <h3 className="font-bold text-slate-900">
                              How was this event?
                            </h3>

                            <button
                              type="button"
                              onClick={closeFeedback}
                              className="text-xl text-slate-400"
                              aria-label="Close feedback"
                            >
                              ×
                            </button>

                          </div>

                          <div className="mt-4 flex justify-center gap-2">

                            {[1, 2, 3, 4, 5].map(
                              (star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() =>
                                    setRating(star)
                                  }
                                  aria-label={`${star} star${
                                    star === 1
                                      ? ""
                                      : "s"
                                  }`}
                                  className={`text-3xl transition ${
                                    star <= rating
                                      ? "text-[#149EAF]"
                                      : "text-slate-300"
                                  }`}
                                >
                                  ★
                                </button>
                              )
                            )}

                          </div>

                          <textarea
                            value={comment}
                            onChange={(e) =>
                              setComment(e.target.value)
                            }
                            placeholder="Anything you'd like to tell us? (optional)"
                            rows={3}
                            className="mt-4 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/10"
                          />

                          <button
                            type="button"
                            onClick={submitFeedback}
                            disabled={
                              rating === 0 ||
                              submitting
                            }
                            className="mt-3 flex w-full items-center justify-center rounded-xl bg-[#149EAF] px-4 py-3 font-semibold text-white transition hover:bg-[#117F8E] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {submitting
                              ? "Submitting..."
                              : "Submit Feedback"}
                          </button>
                        </>
                      )}

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </section>

      <BottomNavigation />

    </main>
  );
}
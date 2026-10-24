
"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

type ResponseStatus = "yes" | "maybe";

type EventResponsesProps = {
  eventId: number;
  goingLabel: string;
  maybeLabel: string;
  prompt: string;
  helperText: string;
  successText: string;
  errorText: string;
};

function getAnonymousVoterId() {
  const storageKey = "lokly-anonymous-voter-id";
  let voterId = window.localStorage.getItem(storageKey);

  if (!voterId) {
    voterId =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            (character) => {
              const random = (Math.random() * 16) | 0;
              const value =
                character === "x" ? random : ((random & 0x3) | 0x8);
              return value.toString(16);
            }
          );

    window.localStorage.setItem(storageKey, voterId);
  }

  return voterId;
}

export default function EventResponses({
  eventId,
  goingLabel,
  maybeLabel,
  prompt,
  helperText,
  successText,
  errorText,
}: EventResponsesProps) {
  const [goingCount, setGoingCount] = useState(0);
  const [maybeCount, setMaybeCount] = useState(0);
  const [selectedStatus, setSelectedStatus] =
    useState<ResponseStatus | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadResponses = useCallback(async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("event_responses")
      .select("status")
      .eq("event_id", eventId);

    if (error) {
      console.error("Lokly: Could not load event responses", error);
      return;
    }

    const responses = data || [];
    setGoingCount(responses.filter((row) => row.status === "yes").length);
    setMaybeCount(responses.filter((row) => row.status === "maybe").length);
  }, [eventId]);

  useEffect(() => {
    let active = true;

    async function loadCurrentResponse() {
      await loadResponses();

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const voterId = user?.id ?? getAnonymousVoterId();

      const { data, error } = await supabase
        .from("event_responses")
        .select("status")
        .eq("event_id", eventId)
        .eq("voter_id", voterId)
        .maybeSingle();

      if (
        active &&
        !error &&
        (data?.status === "yes" || data?.status === "maybe")
      ) {
        setSelectedStatus(data.status);
      }
    }

    loadCurrentResponse();

    return () => {
      active = false;
    };
  }, [eventId, loadResponses]);

  async function submitResponse(status: ResponseStatus) {
    if (saving) return;

    setSaving(true);
    setMessage("");

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const voterId = user?.id ?? getAnonymousVoterId();

      const { error } = await supabase
        .from("event_responses")
        .upsert(
          { event_id: eventId, voter_id: voterId, status },
          { onConflict: "event_id,voter_id" }
        );

      if (error) throw error;

      setSelectedStatus(status);
      setMessage(successText);
      await loadResponses();
    } catch (error) {
      console.error("Lokly: Could not save event response", error);
      setMessage(errorText);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      className="mt-3 rounded-xl bg-[#EFFAFA] px-2.5 py-2 sm:px-4 sm:py-3"
      aria-label={prompt}
    >
      <div className="grid grid-cols-[1.1fr_0.9fr] items-center gap-2 sm:gap-4">
        <div className="grid grid-cols-2 items-center gap-1 border-r border-[#D5EEEE] pr-2 sm:gap-2 sm:pr-3">
          <button
            type="button"
            onClick={() => submitResponse("yes")}
            disabled={saving}
            aria-pressed={selectedStatus === "yes"}
            className={`flex min-w-0 items-center justify-center rounded-lg px-1 py-2 transition disabled:opacity-60 sm:px-2 ${
              selectedStatus === "yes" ? "bg-[#DDF4F5]" : "hover:bg-white/70"
            }`}
          >
            <span className="min-w-0 text-left">
              <span className="block break-words text-xs font-semibold leading-tight text-slate-700">
                {goingLabel}
              </span>
              <span className="mt-0.5 block text-sm font-bold text-[#149EAF]">
                {goingCount}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => submitResponse("maybe")}
            disabled={saving}
            aria-pressed={selectedStatus === "maybe"}
            className={`flex min-w-0 items-center justify-center rounded-lg px-1 py-2 transition disabled:opacity-60 sm:px-2 ${
              selectedStatus === "maybe" ? "bg-[#DDF4F5]" : "hover:bg-white/70"
            }`}
          >
            <span className="min-w-0 text-left">
              <span className="block break-words text-xs font-semibold leading-tight text-slate-700">
                {maybeLabel}
              </span>
              <span className="mt-0.5 block text-sm font-bold text-slate-600">
                {maybeCount}
              </span>
            </span>
          </button>
        </div>

        <div className="min-w-0 py-0.5">
          <p className="text-xs font-bold leading-snug text-slate-800 sm:text-sm">
            {prompt}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-slate-600 sm:text-xs">
            {helperText}
          </p>
          <p className="mt-1 text-[9px] leading-snug text-slate-500 sm:text-[10px]">
            One response per visitor · You can change your answer.
          </p>
        </div>
      </div>

      {message && (
        <p
          role="status"
          className="mt-1 text-center text-[10px] leading-snug text-slate-600"
        >
          {message}
        </p>
      )}
    </section>
  );
}

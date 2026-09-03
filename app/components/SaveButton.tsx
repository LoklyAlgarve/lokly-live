"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

type SaveButtonProps = {
  eventId: number;
  large?: boolean;
};

export default function SaveButton({
  eventId,
  large = false,
}: SaveButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSaved() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSaved(false);
        return;
      }

      const { data } = await supabase
        .from("saved_events")
        .select("id")
        .eq("user_id", user.id)
        .eq("event_id", eventId)
        .maybeSingle();

      setSaved(!!data);
    }

    checkSaved();
  }, [eventId]);

  async function toggleSave() {
    if (loading) return;

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/profile/signin");
      return;
    }

    setLoading(true);

    if (saved) {
      const { error } = await supabase
        .from("saved_events")
        .delete()
        .eq("user_id", user.id)
        .eq("event_id", eventId);

      if (!error) {
        setSaved(false);
      }
    } else {
      const { error } = await supabase
        .from("saved_events")
        .insert({
          user_id: user.id,
          event_id: eventId,
        });

      if (!error) {
        setSaved(true);
      }
    }

    setLoading(false);
  }

  if (large) {
    return (
      <button
        type="button"
        onClick={toggleSave}
        disabled={loading}
        className="flex min-h-14 w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 text-base font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Saving..."
          : saved
          ? "♥ Saved Event"
          : "♡ Save Event"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleSave}
      disabled={loading}
      className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-lg transition hover:scale-105 disabled:opacity-60"
      aria-label={saved ? "Remove from saved events" : "Save event"}
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}
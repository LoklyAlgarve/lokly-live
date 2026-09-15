"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { useLanguage } from "../LanguageContext";

type SaveButtonProps = {
  eventId: number;
  large?: boolean;
  onSavedChange?: (saved: boolean) => void;
  onGoingStatusChange?: (
    status: "yes" | "maybe" | null
  ) => void;
};

type GoingStatus = "yes" | "maybe" | null;

export default function SaveButton({
  eventId,
  large = false,
  onSavedChange,
  onGoingStatusChange,
}: SaveButtonProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPlanningPopup, setShowPlanningPopup] =
    useState(false);

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
        .select("id, going_status")
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
        onSavedChange?.(false);

        // Removing the saved event also removes
        // the user's Going/Maybe response.
        onGoingStatusChange?.(null);
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
        onSavedChange?.(true);

        // Show the planning popup after saving
        // from either the Save Event button or the heart button.
        setShowPlanningPopup(true);
      }
    }

    setLoading(false);
  }

  async function handlePlanningStatus(status: GoingStatus) {
    if (status) {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setShowPlanningPopup(false);
        router.push("/profile/signin");
        return;
      }

      const { error } = await supabase
        .from("saved_events")
        .update({
          going_status: status,
        })
        .eq("user_id", user.id)
        .eq("event_id", eventId);

      if (error) {
        console.error(
          "Lokly: Could not save planning status",
          error
        );
        return;
      }

      // Tell the event page that the user's response changed.
      onGoingStatusChange?.(status);
    }

    setShowPlanningPopup(false);
  }

  function closePlanningPopup() {
    setShowPlanningPopup(false);
  }

  if (large) {
    return (
      <>
        <button
          type="button"
          onClick={toggleSave}
          disabled={loading}
          className="flex min-h-14 w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 text-base font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            t("Saving...")
          ) : saved ? (
            <>
              <span className="mr-2 text-xl text-[#FF6F61]">
                ♥
              </span>
              {t("Saved Event")}
            </>
          ) : (
            <>
              <span className="mr-2 text-xl text-slate-700">
                ♡
              </span>
              {t("Save Event")}
            </>
          )}
        </button>

        {showPlanningPopup && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-5"
            onClick={closePlanningPopup}
          >
            <div
              className="relative w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closePlanningPopup}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label={t("Close")}
              >
                ×
              </button>

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FF6F61]/10">
                <span className="text-4xl text-[#FF6F61] animate-[heartbeat_1.8s_ease-in-out_infinite]">
                  ♥
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-black text-slate-900">
                {t("Support local")}
              </h2>

              <p className="mt-3 text-lg font-semibold text-slate-700">
                {t("Are you planning to go?")}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {t(
                  "Your answer helps us understand which events people are interested in."
                )}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    handlePlanningStatus("yes")
                  }
                  className="flex min-h-12 items-center justify-center rounded-2xl bg-[#149EAF] px-4 font-bold text-white transition hover:bg-[#117F8E]"
                >
                  {t("Yes")}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePlanningStatus("maybe")
                  }
                  className="flex min-h-12 items-center justify-center rounded-2xl border-2 border-[#149EAF] bg-white px-4 font-bold text-[#149EAF] transition hover:bg-[#149EAF]/10"
                >
                  {t("Maybe")}
                </button>
              </div>

              <p className="mt-5 text-xs text-slate-400">
                {t("You can change your answer later.")}
              </p>

              <button
                type="button"
                onClick={closePlanningPopup}
                className="mt-3 text-sm font-semibold text-slate-400 transition hover:text-slate-600"
              >
                {t("Not now")}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={toggleSave}
        disabled={loading}
        className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-lg transition hover:scale-105 disabled:opacity-60"
        aria-label={
          saved
            ? t("Remove from saved events")
            : t("Save event")
        }
      >
        <span
          className={
            saved
              ? "text-[#FF6F61]"
              : "text-slate-700"
          }
        >
          {saved ? "♥" : "♡"}
        </span>
      </button>

      {showPlanningPopup && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-5"
          onClick={closePlanningPopup}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePlanningPopup}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label={t("Close")}
            >
              ×
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FF6F61]/10">
              <span className="text-4xl text-[#FF6F61] animate-[heartbeat_1.8s_ease-in-out_infinite]">
                ♥
              </span>
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-900">
              {t("Support local")}
            </h2>

            <p className="mt-3 text-lg font-semibold text-slate-700">
              {t("Are you planning to go?")}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {t(
                "Your answer helps us understand which events people are interested in."
              )}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  handlePlanningStatus("yes")
                }
                className="flex min-h-12 items-center justify-center rounded-2xl bg-[#149EAF] px-4 font-bold text-white transition hover:bg-[#117F8E]"
              >
                {t("Yes")}
              </button>

              <button
                type="button"
                onClick={() =>
                  handlePlanningStatus("maybe")
                }
                className="flex min-h-12 items-center justify-center rounded-2xl border-2 border-[#149EAF] bg-white px-4 font-bold text-[#149EAF] transition hover:bg-[#149EAF]/10"
              >
                {t("Maybe")}
              </button>
            </div>

            <p className="mt-5 text-xs text-slate-400">
              {t("You can change your answer later.")}
            </p>

            <button
              type="button"
              onClick={closePlanningPopup}
              className="mt-3 text-sm font-semibold text-slate-400 transition hover:text-slate-600"
            >
              {t("Not now")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
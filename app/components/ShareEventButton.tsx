"use client";

type ShareEventButtonProps = {
  title: string;
  date: string;
  location: string;
  eventUrl?: string;
  iconOnly?: boolean;
};

export default function ShareEventButton({
  title,
  date,
  location,
  eventUrl,
  iconOnly = false,
}: ShareEventButtonProps) {
  const handleShare = async () => {
    const eventLink =
      eventUrl ||
      (typeof window !== "undefined"
        ? window.location.href
        : "");

    const message = `🌟 ${title}

📅 ${date}
📍 ${location}

I found this event on Lokly and thought you might like it!

👉 View the event on Lokly:
${eventLink}

Don't have Lokly yet?
Discover what's happening near you:
https://www.lokly.live`;

    // Phone / tablet sharing
    if (
      typeof navigator !== "undefined" &&
      navigator.share
    ) {
      try {
        await navigator.share({
          title: title,
          text: message,
        });

        return;
      } catch {
        // User cancelled the share menu
        return;
      }
    }

    // Desktop fallback - WhatsApp
    const whatsappUrl =
      "https://wa.me/?text=" +
      encodeURIComponent(message);

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share Event"
      title="Share Event"
      className={
        iconOnly
          ? "flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-[#149EAF]/10 hover:text-[#149EAF] sm:h-9 sm:w-9"
          : "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#149EAF] hover:text-[#149EAF]"
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={iconOnly ? "19" : "18"}
        height={iconOnly ? "19" : "18"}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle
          cx="18"
          cy="5"
          r="3"
        />

        <circle
          cx="6"
          cy="12"
          r="3"
        />

        <circle
          cx="18"
          cy="19"
          r="3"
        />

        <path d="m8.6 13.5 6.8 4" />

        <path d="m15.4 6.5-6.8 4" />
      </svg>

      {!iconOnly && (
        <span>Share Event</span>
      )}
    </button>
  );
}
"use client";

type ShareEventButtonProps = {
  title: string;
  date: string;
  location: string;
  eventUrl?: string;
};

export default function ShareEventButton({
  title,
  date,
  location,
  eventUrl,
}: ShareEventButtonProps) {
  const handleShare = async () => {
    const url =
      eventUrl ||
      (typeof window !== "undefined"
        ? window.location.href
        : "");

    const message = `🌟 ${title}

📅 ${date}
📍 ${location}

I found this event on Lokly and thought you might like it!

👉 View the event on Lokly:
${url}

Don't have Lokly yet?
Download Lokly and discover what's happening near you.`;

    // Use the phone's normal share menu
    if (
      typeof navigator !== "undefined" &&
      navigator.share
    ) {
      try {
        await navigator.share({
          title: title,
          text: message,
          url: url,
        });
        return;
      } catch (error) {
        // User cancelled the share menu
        return;
      }
    }

    // Fallback for browsers without native sharing
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
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#149EAF] hover:text-[#149EAF]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 13.5 6.8 4" />
        <path d="m15.4 6.5-6.8 4" />
      </svg>

      <span>Share Event</span>
    </button>
  );
}
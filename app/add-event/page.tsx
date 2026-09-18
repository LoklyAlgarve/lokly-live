"use client";

import { FormEvent, useState } from "react";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { useLanguage } from "../LanguageContext";
import { createClient } from "@/utils/supabase/client";

const EVENT_IMAGE_BUCKET = "event-images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALGARVE_CONCELHOS = [
  "Albufeira",
  "Alcoutim",
  "Aljezur",
  "Castro Marim",
  "Faro",
  "Lagoa",
  "Lagos",
  "Loulé",
  "Monchique",
  "Olhão",
  "Portimão",
  "São Brás de Alportel",
  "Silves",
  "Tavira",
  "Vila do Bispo",
  "Vila Real de Santo António",
];

export default function AddEventPage() {
  const { t } = useLanguage();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setSubmitted(false);
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const supabase = createClient();

    const title = String(formData.get("eventName") || "").trim();
    const category = String(formData.get("category") || "").trim();

    const date = String(formData.get("date") || "").trim();
    const endDate = String(formData.get("endDate") || "").trim();

    const time = String(formData.get("time") || "").trim();
    const endTime = String(formData.get("endTime") || "").trim();

    const location = String(formData.get("location") || "").trim();
    const concelho = String(formData.get("concelho") || "").trim();

    const price = String(formData.get("price") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const website = String(formData.get("website") || "").trim();

    const businessName = String(
      formData.get("businessName") || ""
    ).trim();

    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();

    const wheelchair = String(
      formData.get("wheelchair") || "Not sure"
    );

    const pets = String(
      formData.get("pets") || "Not sure"
    );

    let imageUrl: string | null = null;

    const imageFile = formData.get("image");

    if (imageFile instanceof File && imageFile.size > 0) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(imageFile.type)) {
        setSubmitting(false);
        setErrorMessage(
          t("Please upload a JPG, PNG or WebP image.")
        );
        return;
      }

      if (imageFile.size > MAX_IMAGE_SIZE) {
        setSubmitting(false);
        setErrorMessage(
          t(
            "Your image is too large. Please choose an image under 5 MB."
          )
        );
        return;
      }

      try {
        const extension =
          imageFile.type === "image/png"
            ? "png"
            : imageFile.type === "image/webp"
            ? "webp"
            : "jpg";

        const fileName = `${crypto.randomUUID()}.${extension}`;
        const filePath = `events/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(EVENT_IMAGE_BUCKET)
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            contentType: imageFile.type,
            upsert: false,
          });

        if (uploadError) {
          console.error(
            "Could not upload event image:",
            uploadError
          );

          setSubmitting(false);
          setErrorMessage(
            t(
              "There was a problem uploading your image. Please try again."
            )
          );
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from(EVENT_IMAGE_BUCKET)
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      } catch (error) {
        console.error(
          "Could not upload event image:",
          error
        );

        setSubmitting(false);
        setErrorMessage(
          t(
            "There was a problem uploading your image. Please try again."
          )
        );
        return;
      }
    }

    const { error } = await supabase.from("events").insert({
      title,
      category,

      // START
      date,
      time,

      // END
      end_date: endDate,
      end_time: endTime,

      location,
      concelho,
      price,
      description,
      website,
      image: imageUrl,

      business_name: businessName,
      contact_email: email,
      contact_phone: phone,

      wheelchair_friendly: wheelchair,
      pet_friendly: pets,

      approved: false,
      featured: false,
    });

    if (error) {
      console.error(
        "Could not submit event:",
        error
      );

      setSubmitting(false);
      setErrorMessage(
        t(
          "There was a problem submitting your event. Please try again."
        )
      );
      return;
    }

    try {
      const notificationResponse = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,

          date,
          endDate,

          time,
          endTime,

          location,
          concelho,
          businessName,
          email,
        }),
      });

      if (!notificationResponse.ok) {
        console.error(
          "Event notification could not be sent."
        );
      }
    } catch (notificationError) {
      console.error(
        "Event notification error:",
        notificationError
      );
    }

    setSubmitting(false);
    setSubmitted(true);

    form.reset();
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-7 sm:px-6 lg:px-8">

        {/* PAGE INTRO */}
        <div className="mb-7">
          <h1 className="text-3xl font-bold tracking-tight text-[#051C3F] sm:text-4xl">
            {t("Add an event")}
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            {t(
              "Share an event happening in the Algarve and help people discover what's going on."
            )}
          </p>
        </div>

        {/* SUCCESS */}
        {submitted && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-semibold text-emerald-800">
              {t("Event submitted")}
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              {t(
                "Thank you. We'll review your event before it appears on Lokly."
              )}
            </p>
          </div>
        )}

        {/* ERROR */}
        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {errorMessage}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* =====================================================
              1. YOUR EVENT
          ====================================================== */}
          <section className="rounded-3xl border border-[#149EAF]/70 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#149EAF]/10 text-base font-bold text-[#149EAF]">
                1
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#051C3F]">
                  {t("Your event")}
                </h2>

                <p className="text-sm text-slate-500">
                  {t("Tell us about your event.")}
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* EVENT NAME */}
              <div>
                <label
                  htmlFor="eventName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Event name")} *
                </label>

                <input
                  id="eventName"
                  name="eventName"
                  type="text"
                  required
                  placeholder={t(
                    "e.g. Summer Music Festival"
                  )}
                  className="w-full rounded-xl border border-[#149EAF]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/10"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Category")} *
                </label>

                <select
                  id="category"
                  name="category"
                  defaultValue=""
                  required
                  className="w-full rounded-xl border border-[#149EAF]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/10"
                >
                  <option value="">
                    {t("Select a category")}
                  </option>

                  <option value="Arts & Culture">
                    {t("Arts & Culture")}
                  </option>

                  <option value="Comedy">
                    {t("Comedy")}
                  </option>

                  <option value="Community">
                    {t("Community")}
                  </option>

                  <option value="Exhibitions">
                    {t("Exhibitions")}
                  </option>

                  <option value="Family">
                    {t("Family")}
                  </option>

                  <option value="Festival">
                    {t("Festival")}
                  </option>

                  <option value="Music">
                    {t("Music")}
                  </option>

                  <option value="Nightlife">
                    {t("Nightlife")}
                  </option>

                  <option value="Retreat">
                    {t("Retreat")}
                  </option>

                  <option value="Sport">
                    {t("Sport")}
                  </option>

                  <option value="Theatre">
                    {t("Theatre")}
                  </option>

                  <option value="Workshop">
                    {t("Workshop")}
                  </option>
                </select>
              </div>

              {/* DESCRIPTION */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Description")}
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder={t(
                    "Tell people a little about the event..."
                  )}
                  className="w-full resize-none rounded-xl border border-[#149EAF]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/10"
                />
              </div>

            </div>
          </section>

          {/* =====================================================
              2. WHEN & WHERE
          ====================================================== */}
          <section className="rounded-3xl border border-[#149EAF]/70 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#149EAF]/10 text-base font-bold text-[#149EAF]">
                2
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#051C3F]">
                  {t("When & where")}
                </h2>

                <p className="text-sm text-slate-500">
                  {t(
                    "Let people know when and where it's happening."
                  )}
                </p>
              </div>
            </div>

            {/* DATES */}
            <div className="grid gap-5 sm:grid-cols-2">

              {/* START DATE */}
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Start date")} *
                </label>

                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  className="w-full rounded-xl border border-[#149EAF]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/10"
                />
              </div>

              {/* END DATE */}
              <div>
                <label
                  htmlFor="endDate"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("End date")} *
                </label>

                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  className="w-full rounded-xl border border-[#149EAF]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/10"
                />
              </div>

              {/* START TIME */}
              <div>
                <label
                  htmlFor="time"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Start time")} *
                </label>

                <input
                  id="time"
                  name="time"
                  type="time"
                  required
                  className="w-full rounded-xl border border-[#149EAF]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/10"
                />
              </div>

              {/* END TIME */}
              <div>
                <label
                  htmlFor="endTime"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("End time")} *
                </label>

                <input
                  id="endTime"
                  name="endTime"
                  type="time"
                  required
                  className="w-full rounded-xl border border-[#149EAF]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/10"
                />
              </div>

            </div>

            {/* LOCATION */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">

              {/* LOCATION */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Venue / location")} *
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  placeholder={t(
                    "e.g. Mercado Municipal, Loulé"
                  )}
                  className="w-full rounded-xl border border-[#149EAF]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/10"
                />
              </div>

              {/* CONCELHO */}
              <div>
                <label
                  htmlFor="concelho"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Concelho")} *
                </label>

                <select
                  id="concelho"
                  name="concelho"
                  defaultValue=""
                  required
                  className="w-full rounded-xl border border-[#149EAF]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/10"
                >
                  <option value="">
                    {t("Select a concelho")}
                  </option>

                  {ALGARVE_CONCELHOS.map(
                    (concelhoName) => (
                      <option
                        key={concelhoName}
                        value={concelhoName}
                      >
                        {concelhoName}
                      </option>
                    )
                  )}
                </select>
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-500">
              {t("Enter the venue name or location.")}
            </p>

          </section>

          {/* =====================================================
              3. EVENT DETAILS
          ====================================================== */}
          <section className="rounded-3xl border border-[#149EAF]/70 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#149EAF]/10 text-base font-bold text-[#149EAF]">
                3
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#051C3F]">
                  {t("Event details")}
                </h2>

                <p className="text-sm text-slate-500">
                  {t(
                    "Add pricing, website and accessibility information."
                  )}
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {/* PRICE */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Price")}
                </label>

                <input
                  id="price"
                  name="price"
                  type="text"
                  placeholder={t(
                    "e.g. Free, €10, From €15"
                  )}
                  className="w-full rounded-xl border border-[#149EAF]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/10"
                />
              </div>

              {/* WEBSITE */}
              <div>
                <label
                  htmlFor="website"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Website / booking link")}
                </label>

                <input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://..."
                  className="w-full rounded-xl border border-[#149EAF]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/10"
                />
              </div>

              {/* IMAGE */}
              <div className="lg:row-span-2">
                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Event image")}
                </label>

                <label
                  htmlFor="image"
                  className="flex min-h-[112px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#149EAF]/50 bg-[#149EAF]/[0.02] px-4 py-4 text-center transition hover:bg-[#149EAF]/[0.05]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mb-2 h-8 w-8 text-[#149EAF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="16"
                      rx="2"
                    />

                    <circle
                      cx="8.5"
                      cy="9"
                      r="1.5"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m3 17 5-5 4 4 2-2 7 6"
                    />
                  </svg>

                  <span className="text-sm font-medium text-[#051C3F]">
                    {t("Upload an image")}
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    {t(
                      "JPG, PNG or WebP - maximum 5 MB."
                    )}
                  </span>
                </label>

                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                />
              </div>

              {/* WHEELCHAIR */}
              <div>
                <p className="mb-3 text-sm font-medium text-slate-700">
                  {t("Wheelchair friendly?")}
                </p>

                <div className="flex flex-wrap gap-2">
                  {["Yes", "No", "Not sure"].map(
                    (option) => (
                      <label
                        key={option}
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#149EAF]/30 px-3 py-2.5 text-sm text-slate-700 transition hover:bg-[#149EAF]/5"
                      >
                        <input
                          type="radio"
                          name="wheelchair"
                          value={option}
                          defaultChecked={
                            option === "Not sure"
                          }
                          className="h-4 w-4 accent-[#149EAF]"
                        />

                        {t(option)}
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* PET FRIENDLY */}
              <div>
                <p className="mb-3 text-sm font-medium text-slate-700">
                  {t("Pet friendly?")}
                </p>

                <div className="flex flex-wrap gap-2">
                  {["Yes", "No", "Not sure"].map(
                    (option) => (
                      <label
                        key={option}
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#149EAF]/30 px-3 py-2.5 text-sm text-slate-700 transition hover:bg-[#149EAF]/5"
                      >
                        <input
                          type="radio"
                          name="pets"
                          value={option}
                          defaultChecked={
                            option === "Not sure"
                          }
                          className="h-4 w-4 accent-[#149EAF]"
                        />

                        {t(option)}
                      </label>
                    )
                  )}
                </div>
              </div>

            </div>
          </section>

          {/* =====================================================
              4. BUSINESS DETAILS
          ====================================================== */}
          <section className="rounded-3xl border border-[#149EAF]/70 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#149EAF]/10 text-base font-bold text-[#149EAF]">
                4
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#051C3F]">
                  {t("Your business details")}
                </h2>

                <p className="text-sm text-slate-500">
                  {t(
                    "Let us know who is organising the event."
                  )}
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {/* BUSINESS */}
              <div>
                <label
                  htmlFor="businessName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Business / organiser name")} *
                </label>

                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  placeholder={t(
                    "Your business or organisation"
                  )}
                  className="w-full rounded-xl border border-[#149EAF]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/10"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Email")} *
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t(
                    "Your email address"
                  )}
                  className="w-full rounded-xl border border-[#149EAF]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/10"
                />
              </div>

              {/* PHONE */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Phone")}
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={t(
                    "Your phone number"
                  )}
                  className="w-full rounded-xl border border-[#149EAF]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/10"
                />
              </div>

            </div>
          </section>

          {/* SUBMIT */}
          <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:justify-end">

            <p className="text-center text-xs text-slate-500 sm:mr-auto sm:text-left">
              {t(
                "Your event will be reviewed before it goes live on Lokly."
              )}
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-[#149EAF] px-8 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-[#0f8998] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[190px]"
            >
              {submitting
                ? t("Submitting...")
                : t("Submit event")}
            </button>

          </div>

        </form>
      </main>

      <BottomNavigation />
    </div>
  );
}
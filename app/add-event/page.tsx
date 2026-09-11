"use client";

import { FormEvent, useState } from "react";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { useLanguage } from "../LanguageContext";
import { createClient } from "@/utils/supabase/client";

const EVENT_IMAGE_BUCKET = "event-images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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
    const time = String(formData.get("time") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const price = String(formData.get("price") || "Free").trim();
    const description = String(formData.get("description") || "").trim();
    const website = String(formData.get("website") || "").trim();
    const businessName = String(formData.get("businessName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();

    const wheelchair = String(
      formData.get("wheelchair") || "Not sure"
    );

    const pets = String(formData.get("pets") || "Not sure");

    /*
     * ---------------------------------------------------------
     * 1. Find the event coordinates from the location
     * ---------------------------------------------------------
     */

    let latitude: number | null = null;
    let longitude: number | null = null;

    if (location) {
      try {
        const searchAddress = `${location}, Portugal`;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=pt&q=${encodeURIComponent(
            searchAddress
          )}`
        );

        if (!response.ok) {
          throw new Error("Geocoding request failed");
        }

        const results = await response.json();

        if (results.length === 0) {
          setSubmitting(false);
          setErrorMessage(
            t(
              "We couldn't find that location. Please check the venue and address and try again."
            )
          );
          return;
        }

        latitude = Number(results[0].lat);
        longitude = Number(results[0].lon);
      } catch (error) {
        console.error("Could not find event coordinates:", error);

        setSubmitting(false);
        setErrorMessage(
          t(
            "We couldn't find the location right now. Please check the address and try again."
          )
        );
        return;
      }
    }

    /*
     * ---------------------------------------------------------
     * 2. Upload the event image
     * ---------------------------------------------------------
     */

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
          t("Your image is too large. Please choose an image under 5 MB.")
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
          console.error("Could not upload event image:", uploadError);

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
        console.error("Could not upload event image:", error);

        setSubmitting(false);
        setErrorMessage(
          t(
            "There was a problem uploading your image. Please try again."
          )
        );
        return;
      }
    }

    /*
     * ---------------------------------------------------------
     * 3. Save the event
     * ---------------------------------------------------------
     */

    const { error } = await supabase.from("events").insert({
      title,
      category,
      date,
      time,
      location,
      price,
      description,
      website,
      image: imageUrl,
      business_name: businessName,
      contact_email: email,
      contact_phone: phone,
      latitude,
      longitude,
      wheelchair_friendly: wheelchair,
      pet_friendly: pets,
      approved: false,
      featured: false,
    });

    if (error) {
      console.error("Could not submit event:", error);

      setSubmitting(false);
      setErrorMessage(
        t(
          "There was a problem submitting your event. Please try again."
        )
      );
      return;
    }

    /*
     * ---------------------------------------------------------
     * 4. Send notification email
     * ---------------------------------------------------------
     */

    try {
      const notificationResponse = await fetch("/api/events/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          date,
          time,
          location,
          businessName,
          email,
        }),
      });

      if (!notificationResponse.ok) {
        console.error("Event notification could not be sent.");
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

      <main className="mx-auto w-full max-w-3xl px-4 pb-10 pt-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {t("Add an event")}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {t(
              "Share an event happening in the Algarve and help people discover what's going on."
            )}
          </p>
        </div>

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

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {errorMessage}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* YOUR EVENT */}

          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {t("Your event")}
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <label
                  htmlFor="eventName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Event name")}
                </label>

                <input
                  id="eventName"
                  name="eventName"
                  type="text"
                  placeholder={t("e.g. Summer Music Festival")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Category")}
                </label>

                <select
                  id="category"
                  name="category"
                  defaultValue=""
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                >
                  <option value="">
                    {t("Select a category")}
                  </option>
                  <option value="Arts & Culture">
                    {t("Arts & Culture")}
                  </option>
                  <option value="Comedy">{t("Comedy")}</option>
                  <option value="Community">{t("Community")}</option>
                  <option value="Exhibitions">
                    {t("Exhibitions")}
                  </option>
                  <option value="Family">{t("Family")}</option>
                  <option value="Festival">{t("Festival")}</option>
                  <option value="Music">{t("Music")}</option>
                  <option value="Nightlife">
                    {t("Nightlife")}
                  </option>
                  <option value="Retreat">{t("Retreat")}</option>
                  <option value="Sport">{t("Sport")}</option>
                  <option value="Theatre">{t("Theatre")}</option>
                  <option value="Workshop">{t("Workshop")}</option>
                </select>
              </div>

              <div>
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
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>
          </section>

          {/* WHEN & WHERE */}

          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {t("When & where")}
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Date")}
                </label>

                <input
                  id="date"
                  name="date"
                  type="date"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Time")}
                </label>

                <input
                  id="time"
                  name="time"
                  type="time"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Venue / location")}
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder={t(
                    "e.g. Mercado Municipal, Loulé"
                  )}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

                <p className="mt-2 text-xs text-slate-500">
                  {t(
                    "Please include the venue name and town so we can place the event accurately on the map."
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* PRICE & BOOKING */}

          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {t("Price & booking")}
            </h2>

            <div className="mt-5 space-y-5">
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
                  placeholder={t("e.g. Free, €10, From €15")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>
          </section>

          {/* CONTACT */}

          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {t("Contact")}
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <label
                  htmlFor="businessName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Business / organiser name")}
                </label>

                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  placeholder={t("Your business or organisation")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Email")}
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("Your email address")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

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
                  placeholder={t("Your phone number")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>
          </section>

          {/* MORE DETAILS */}

          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {t("A few more details")}
            </h2>

            <div className="mt-5 space-y-7">
              {/* IMAGE */}

              <div>
                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Event image")}
                </label>

                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-teal-700 hover:file:bg-teal-100"
                />

                <p className="mt-2 text-xs text-slate-500">
                  {t("JPG, PNG or WebP - maximum 5 MB.")}
                </p>
              </div>

              {/* WHEELCHAIR */}

              <div>
                <p className="mb-3 text-sm font-medium text-slate-700">
                  {t("Wheelchair friendly?")}
                </p>

                <div className="flex flex-wrap gap-3">
                  {["Yes", "No", "Not sure"].map((option) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
                    >
                      <input
                        type="radio"
                        name="wheelchair"
                        value={option}
                        defaultChecked={option === "Not sure"}
                        className="h-4 w-4 accent-teal-600"
                      />

                      {t(option)}
                    </label>
                  ))}
                </div>
              </div>

              {/* PETS */}

              <div>
                <p className="mb-3 text-sm font-medium text-slate-700">
                  {t("Pet friendly?")}
                </p>

                <div className="flex flex-wrap gap-3">
                  {["Yes", "No", "Not sure"].map((option) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
                    >
                      <input
                        type="radio"
                        name="pets"
                        value={option}
                        defaultChecked={option === "Not sure"}
                        className="h-4 w-4 accent-teal-600"
                      />

                      {t(option)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-teal-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? t("Submitting...")
              : t("Submit event")}
          </button>
        </form>
      </main>

      <BottomNavigation />
    </div>
  );
}
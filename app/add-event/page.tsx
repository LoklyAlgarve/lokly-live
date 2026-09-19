"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { useLanguage } from "../LanguageContext";
import { createClient } from "@/utils/supabase/client";

const EVENT_IMAGE_BUCKET = "event-images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const EVENT_CATEGORIES = [
  "Music",
  "Food & Drink",
  "Arts & Culture",
  "Wellbeing",
  "Family",
  "Markets & Shopping",
  "Sport",
  "Festivals",
  "Exhibitions",
  "Workshops",
];

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
  const { t, language } = useLanguage();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedImagePreview, setSelectedImagePreview] =
    useState<string | null>(null);

  const [selectedImageName, setSelectedImageName] =
    useState("");

  useEffect(() => {
    return () => {
      if (selectedImagePreview) {
        URL.revokeObjectURL(selectedImagePreview);
      }
    };
  }, [selectedImagePreview]);

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    setErrorMessage("");

    if (!file) {
      setSelectedImageName("");
      setSelectedImagePreview(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setSelectedImageName("");
      setSelectedImagePreview(null);

      setErrorMessage(
        t("Please upload a JPG, PNG or WebP image.")
      );

      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setSelectedImageName("");
      setSelectedImagePreview(null);

      setErrorMessage(
        t(
          "Your image is too large. Please choose an image under 5 MB."
        )
      );

      return;
    }

    setSelectedImageName(file.name);

    if (selectedImagePreview) {
      URL.revokeObjectURL(selectedImagePreview);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setSelectedImagePreview(previewUrl);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);
    setSubmitted(false);
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const supabase = createClient();

    const title = String(
      formData.get("eventName") || ""
    ).trim();

    const category = String(
      formData.get("category") || ""
    ).trim();

    const date = String(
      formData.get("date") || ""
    ).trim();

    const endDate = String(
      formData.get("endDate") || ""
    ).trim();

    const time = String(
      formData.get("time") || ""
    ).trim();

    const endTime = String(
      formData.get("endTime") || ""
    ).trim();

    const location = String(
      formData.get("location") || ""
    ).trim();

    const concelhoValue = String(
      formData.get("concelho") || ""
    ).trim();

    const concelho =
      concelhoValue === ""
        ? null
        : concelhoValue;

    const price = String(
      formData.get("price") || ""
    ).trim();

    const description = String(
      formData.get("description") || ""
    ).trim();

    const additionalComments = String(
      formData.get("additionalComments") || ""
    ).trim();

    const website = String(
      formData.get("website") || ""
    ).trim();

    const businessName = String(
      formData.get("businessName") || ""
    ).trim();

    const email = String(
      formData.get("email") || ""
    ).trim();

    const phone = String(
      formData.get("phone") || ""
    ).trim();

    const wheelchair = String(
      formData.get("wheelchair") || "Not sure"
    );

    const pets = String(
      formData.get("pets") || "Not sure"
    );

    let imageUrl: string | null = null;

    const imageFile = formData.get("image");

    /*
     * IMAGE UPLOAD
     */

    if (
      imageFile instanceof File &&
      imageFile.size > 0
    ) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(imageFile.type)) {
        setSubmitting(false);

        setErrorMessage(
          t(
            "Please upload a JPG, PNG or WebP image."
          )
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

        const fileName =
          `${crypto.randomUUID()}.${extension}`;

        const filePath =
          `events/${fileName}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from(EVENT_IMAGE_BUCKET)
          .upload(
            filePath,
            imageFile,
            {
              cacheControl: "3600",
              contentType:
                imageFile.type,
              upsert: false,
            }
          );

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

        const {
          data: publicUrlData,
        } = supabase.storage
          .from(EVENT_IMAGE_BUCKET)
          .getPublicUrl(filePath);

        imageUrl =
          publicUrlData.publicUrl;
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

    /*
     * DETECT EVENT LANGUAGE
     *
     * Lokly will translate event information for
     * visitors who use another language.
     *
     * We therefore detect the language of the
     * event when it is submitted and store it
     * in Supabase.
     *
     * If detection fails, we use the current
     * Lokly language as a fallback.
     */

    let eventLanguage =
      language === "pt"
        ? "Portuguese"
        : "English";

    if (title || description) {
      try {
        const languageResponse =
          await fetch(
            "/api/translate-event",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                action: "detect",
                title,
                description,
              }),
            }
          );

        if (languageResponse.ok) {
          const languageData =
            await languageResponse.json();

          const detectedLanguage =
            String(
              languageData?.sourceLanguage ||
                ""
            ).trim();

          if (
            detectedLanguage ===
              "English" ||
            detectedLanguage ===
              "Portuguese"
          ) {
            eventLanguage =
              detectedLanguage;
          }
        }
      } catch (languageError) {
        console.error(
          "Event language detection failed. Using current Lokly language instead:",
          languageError
        );
      }
    }

    /*
     * SAVE EVENT TO SUPABASE
     */

    const { error } =
      await supabase
        .from("events")
        .insert({
          title,
          category,

          event_language:
            eventLanguage,

          date,
          end_date: endDate,

          time,
          end_time: endTime,

          location,
          concelho,

          price,
          description,
          additional_comments:
            additionalComments,

          website,
          image: imageUrl,

          business_name:
            businessName,
          contact_email: email,
          contact_phone: phone,

          wheelchair_friendly:
            wheelchair,
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

    /*
     * SEND EMAIL NOTIFICATION
     */

    try {
      const notificationResponse =
        await fetch(
          "/api/events",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              title,
              category,

              date,
              endDate,

              time,
              endTime,

              location,
              concelho:
                concelhoValue,

              businessName,
              email,
            }),
          }
        );

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

    if (selectedImagePreview) {
      URL.revokeObjectURL(
        selectedImagePreview
      );
    }

    setSelectedImagePreview(null);
    setSelectedImageName("");
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


        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* YOUR EVENT */}

          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">

            <h2 className="text-lg font-semibold text-slate-900">
              {t("Your event")}
            </h2>


            <div className="mt-5 space-y-5">

              {/* EVENT NAME */}

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
                  placeholder={t(
                    "e.g. Summer Music Festival"
                  )}
                  className="w-full rounded-xl border border-[#051C3F]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#089997] focus:ring-2 focus:ring-[#089997]/10"
                />

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {t(
                    "Please use the official name of your event. Lokly may translate this for visitors in other languages."
                  )}
                </p>

              </div>


              {/* CATEGORY */}

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
                  className="w-full rounded-xl border border-[#051C3F]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#089997] focus:ring-2 focus:ring-[#089997]/10"
                >

                  <option value="">
                    {t("Select a category")}
                  </option>

                  {EVENT_CATEGORIES.map(
                    (categoryName) => (
                      <option
                        key={categoryName}
                        value={categoryName}
                      >
                        {t(categoryName)}
                      </option>
                    )
                  )}

                </select>

              </div>


              {/* DESCRIPTION */}

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
                  className="w-full resize-none rounded-xl border border-[#051C3F]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#089997] focus:ring-2 focus:ring-[#089997]/10"
                />

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {t(
                    "Please write your description clearly and naturally. Lokly may automatically translate it, so avoid abbreviations or wording that could be confusing when translated."
                  )}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {t(
                    "Tip: include the important details — what the event is, what's included, who it's for and anything visitors need to know."
                  )}
                </p>

              </div>

            </div>

          </section>


          {/* WHEN & WHERE */}

          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">

            <h2 className="text-lg font-semibold text-slate-900">
              {t("When & where")}
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">

              {/* START DATE */}

              <div>

                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Start date")}
                </label>

                <input
                  id="date"
                  name="date"
                  type="date"
                  className="w-full rounded-xl border border-[#051C3F]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#089997] focus:ring-2 focus:ring-[#089997]/10"
                />

              </div>


              {/* END DATE */}

              <div>

                <label
                  htmlFor="endDate"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("End date")}
                </label>

                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  className="w-full rounded-xl border border-[#051C3F]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#089997] focus:ring-2 focus:ring-[#089997]/10"
                />

              </div>


              {/* START TIME */}

              <div>

                <label
                  htmlFor="time"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Start time")}
                </label>

                <input
                  id="time"
                  name="time"
                  type="time"
                  className="w-full rounded-xl border border-[#051C3F]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#089997] focus:ring-2 focus:ring-[#089997]/10"
                />

              </div>


              {/* END TIME */}

              <div>

                <label
                  htmlFor="endTime"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("End time")}
                </label>

                <input
                  id="endTime"
                  name="endTime"
                  type="time"
                  className="w-full rounded-xl border border-[#051C3F]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#089997] focus:ring-2 focus:ring-[#089997]/10"
                />

              </div>


              {/* CONCELHO */}

              <div className="sm:col-span-2">

                <label
                  htmlFor="concelho"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("Concelho")}
                </label>

                <select
                  id="concelho"
                  name="concelho"
                  defaultValue=""
                  className="w-full rounded-xl border border-[#051C3F]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#089997] focus:ring-2 focus:ring-[#089997]/10"
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


              {/* LOCATION */}

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
                  className="w-full rounded-xl border border-[#051C3F]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#089997] focus:ring-2 focus:ring-[#089997]/10"
                />

                <p className="mt-2 text-xs text-slate-500">
                  {t(
                    "Enter the venue name or location."
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
                  className="w-full rounded-xl border border-[#051C3F]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#089997] focus:ring-2 focus:ring-[#089997]/10"
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
                  className="w-full rounded-xl border border-[#051C3F]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#089997] focus:ring-2 focus:ring-[#089997]/10"
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

              {/* BUSINESS */}

              <div>

                <label
                  htmlFor="businessName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t(
                    "Business / organiser name"
                  )}
                </label>

                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  placeholder={t(
                    "Your business or organisation"
                  )}
                  className="w-full rounded-xl border border-[#051C3F]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#089997] focus:ring-2 focus:ring-[#089997]/10"
                />

              </div>


              {/* EMAIL */}

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
                  placeholder={t(
                    "Your email address"
                  )}
                  className="w-full rounded-xl border border-[#051C3F]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#089997] focus:ring-2 focus:ring-[#089997]/10"
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
                  className="w-full rounded-xl border border-[#051C3F]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#089997] focus:ring-2 focus:ring-[#089997]/10"
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
                  onChange={handleImageChange}
                  className="block w-full rounded-xl border border-[#051C3F]/30 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-teal-700 hover:file:bg-teal-100"
                />

                <p className="mt-2 text-xs text-slate-500">
                  {t(
                    "JPG, PNG or WebP - maximum 5 MB."
                  )}
                </p>

                {selectedImageName && (
                  <p className="mt-2 text-sm font-medium text-[#051C3F]">
                    {selectedImageName}
                  </p>
                )}

                {selectedImagePreview && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-[#051C3F]/20 bg-slate-50">

                    <img
                      src={selectedImagePreview}
                      alt={t(
                        "Selected event image"
                      )}
                      className="h-48 w-full object-cover"
                    />

                  </div>
                )}

              </div>


              {/* WHEELCHAIR */}

              <div>

                <p className="mb-3 text-sm font-medium text-slate-700">
                  {t(
                    "Wheelchair friendly?"
                  )}
                </p>

                <div className="flex flex-wrap gap-3">

                  {[
                    "Yes",
                    "No",
                    "Not sure",
                  ].map((option) => (

                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#051C3F]/30 px-4 py-3 text-sm text-slate-700"
                    >

                      <input
                        type="radio"
                        name="wheelchair"
                        value={option}
                        defaultChecked={
                          option ===
                          "Not sure"
                        }
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

                  {[
                    "Yes",
                    "No",
                    "Not sure",
                  ].map((option) => (

                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#051C3F]/30 px-4 py-3 text-sm text-slate-700"
                    >

                      <input
                        type="radio"
                        name="pets"
                        value={option}
                        defaultChecked={
                          option ===
                          "Not sure"
                        }
                        className="h-4 w-4 accent-teal-600"
                      />

                      {t(option)}

                    </label>

                  ))}

                </div>

              </div>


              {/* ADDITIONAL COMMENTS */}

              <div>

                <label
                  htmlFor="additionalComments"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t(
                    "Anything else we should know?"
                  )}
                </label>

                <p className="mb-3 text-xs text-slate-500">
                  {t(
                    "Optional — tell us anything that might help us understand or promote your event."
                  )}
                </p>

                <textarea
                  id="additionalComments"
                  name="additionalComments"
                  rows={4}
                  placeholder={t(
                    "Anything else you'd like to tell us?"
                  )}
                  className="w-full resize-none rounded-xl border border-[#051C3F]/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#089997] focus:ring-2 focus:ring-[#089997]/10"
                />

              </div>

            </div>

          </section>


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-[#089997] px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-[#078583] disabled:cursor-not-allowed disabled:opacity-60"
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
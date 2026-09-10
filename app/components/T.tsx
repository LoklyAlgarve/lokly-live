"use client";

import { useLanguage } from "../LanguageContext";

type Props = {
  k:
    | "DISCOVER THE ALGARVE"
    | "Discover events near you"
    | "Find events near me"
    | "Featured Events"
    | "Hand-picked events happening across the Algarve."
    | "All Events"
    | "Browse everything happening in the Algarve."
    | "No events found"
    | "We couldn't load the events from Lokly yet.";
};

export default function T({ k }: Props) {
  const { t } = useLanguage();

  return t(k);
}
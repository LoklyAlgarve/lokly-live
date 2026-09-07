"use client";

import { useLanguage } from "../LanguageContext";

const translations = {
  en: {
    discover: "DISCOVER THE ALGARVE",
    hero: "Discover events near you",
    nearMe: "Find events near me",
    featured: "Featured Events",
    featuredSub: "Hand-picked events happening across the Algarve.",
    allEvents: "All Events",
    allEventsSub: "Browse everything happening in the Algarve.",
    noEvents: "No events found",
    noEventsSub: "We couldn't load the events from Lokly yet.",
  },
  pt: {
    discover: "DESCUBRA O ALGARVE",
    hero: "Descubra eventos perto de si",
    nearMe: "Encontrar eventos perto de mim",
    featured: "Eventos em destaque",
    featuredSub: "Eventos selecionados em todo o Algarve.",
    allEvents: "Todos os eventos",
    allEventsSub: "Veja tudo o que está a acontecer no Algarve.",
    noEvents: "Nenhum evento encontrado",
    noEventsSub: "Ainda não foi possível carregar os eventos do Lokly.",
  },
};

type Key = keyof typeof translations.en;

export default function T({ k }: { k: Key }) {
  const { language } = useLanguage();

  return translations[language][k];
}
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Language = "en" | "pt";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: string) => string;
};

const translations: Record<string, string> = {
  // Navigation
  "Home": "Início",
  "Search": "Pesquisar",
  "Map": "Mapa",
  "Saved Events": "Eventos guardados",
  "Past Events": "Eventos anteriores",
  "My Profile": "O meu perfil",
  "My Location": "A minha localização",
  "Notifications": "Notificações",
  "About Lokly": "Sobre o Lokly",
  "Tell a Friend": "Fale do Lokly a um amigo",
  "Contact Us": "Contacte-nos",

  // Home
  "Discover the Algarve": "Descubra o Algarve",
  "What's happening": "O que está a acontecer",
  "near you?": "perto de si?",
  "What's on": "O que há para fazer",
  "What's on near you?": "O que se passa perto de si?",
  "Events, experiences and local gems all in one place.":
    "Eventos, experiências e tesouros locais, tudo num só lugar.",
  "Near Me": "Perto de mim",
  "Today": "Hoje",
  "This Weekend": "Este fim de semana",
  "Free": "Grátis",
  "Filters": "Filtros",
  "Clear filters": "Limpar filtros",
  "Filter by event": "Filtrar por categoria",
  "Filter by category": "Filtrar por categoria",
  "All event types": "Todos os tipos de evento",
  "Filter by location": "Filtrar por localização",
  "All locations": "Todas as localizações",
  "Events": "Eventos",
  "Discover what's happening across the Algarve":
    "Descubra o que está a acontecer por todo o Algarve",
  "Loading events...": "A carregar eventos...",
  "Nothing to see here… yet!": "Nada para ver aqui… ainda!",
  "Try changing your filters.": "Tente alterar os seus filtros.",

  // Common
  "Loading...": "A carregar...",
  "Save": "Guardar",
  "Saved": "Guardado",
  "Back": "Voltar",
  "Close": "Fechar",
  "Cancel": "Cancelar",
  "Submit": "Enviar",
  "Email us": "Envie-nos um email",

  // Categories
  "Music": "Música",
  "Festival": "Festival",
  "Market": "Mercado",
  "Food & Drink": "Comida e bebida",
  "Sport": "Desporto",
  "Family": "Família",
  "Arts & Culture": "Artes e cultura",
  "Nightlife": "Vida noturna",
  "Comedy": "Comédia",
  "Theatre": "Teatro",
  "Exhibitions": "Exposições",
  "Workshop": "Workshop",
  "Charity": "Caridade",
  "Community": "Comunidade",
  "Retreat": "Retiro",

  // Profile
  "Manage your Lokly account and preferences.":
    "Gerir a sua conta e preferências do Lokly.",
  "Sign in to save your favourite events.":
    "Inicie sessão para guardar os seus eventos favoritos.",
  "Sign In": "Iniciar sessão",
  "Create Account": "Criar conta",
  "You're signed in": "Sessão iniciada",
  "Your favourite events can now be saved to your account.":
    "Agora pode guardar os seus eventos favoritos na sua conta.",
  "Sign Out": "Terminar sessão",
  "Preferences": "Preferências",
  "Manage event notifications": "Gerir notificações de eventos",
  "Location": "Localização",

  // Saved events
  "Your favourite events all in one place.":
    "Os seus eventos favoritos, todos num só lugar.",
  "Loading your saved events...":
    "A carregar os seus eventos guardados...",
  "No saved events yet": "Ainda não tem eventos guardados",
  "Tap the heart on an event to save it here.":
    "Toque no coração de um evento para o guardar aqui.",

  // Map
  "Loading map...": "A carregar o mapa...",
  "Event Map": "Mapa de eventos",
  "Discover events happening across the Algarve.":
    "Descubra os eventos que acontecem por todo o Algarve.",
  "Finding you...": "A encontrar...",
  "All Categories": "Todas as categorias",
  "All Areas": "Todas as áreas",
  "Events near you": "Eventos perto de si",
  "Clear filters": "Limpar filtros",

  // General
  "Yes": "Sim",
  "No": "Não",
  "OK": "OK",
};

const LanguageContext = createContext<
  LanguageContextType | undefined
>(undefined);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>("en");

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem("lokly-language");

    if (
      savedLanguage === "pt" ||
      savedLanguage === "en"
    ) {
      setLanguageState(savedLanguage);
    }
  }, []);

  function setLanguage(language: Language) {
    setLanguageState(language);
    localStorage.setItem(
      "lokly-language",
      language
    );
  }

  function t(text: string) {
    if (language === "en") {
      return text;
    }

    return translations[text] ?? text;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}
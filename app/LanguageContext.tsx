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
  "My Saved": "Meus guardados",
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

  // Event Card
  "TODAY": "HOJE",
  "Directions": "Como chegar",
  "Details": "Detalhes",
  "Planning to go?": "Está a pensar ir?",
  "Yes": "Sim",
  "Maybe": "Talvez",

  // Save / Planning Popup
  "Save": "Guardar",
  "Save Event": "Guardar evento",
  "Save event": "Guardar evento",
  "Saved": "Guardado",
  "Saved Event": "Evento guardado",
  "Remove from saved events": "Remover dos eventos guardados",
  "Saving...": "A guardar...",
  "Support local": "Apoie a comunidade local",
  "Are you planning to go?": "Está a pensar ir?",
  "Your answer helps us understand which events people are interested in.":
    "A sua resposta ajuda-nos a perceber quais os eventos que despertam mais interesse.",
  "You can change your answer later.":
    "Pode alterar a sua resposta mais tarde.",
  "Not now": "Agora não",

  // Common
  "Loading...": "A carregar...",
  "Back": "Voltar",
  "Close": "Fechar",
  "Cancel": "Cancelar",
  "Submit": "Enviar",
  "Email us": "Envie-nos um email",

  // Event Details
  "All Events": "Todos os eventos",
  "Loading event...": "A carregar evento...",
  "Event not found": "Evento não encontrado",
  "We couldn't find this event.":
    "Não foi possível encontrar este evento.",
  "Back to Events": "Voltar aos eventos",
  "Date": "Data",
  "Time": "Hora",
  "Not specified": "Não especificado",
  "Price": "Preço",
  "Wheelchair Friendly": "Acessível a cadeiras de rodas",
  "Pet Friendly": "Aceita animais",
  "Unknown": "Desconhecido",
  "About this event": "Sobre este evento",
  "Event Website": "Site do evento",

  // Past Events
  "Events you may have missed.":
    "Eventos que pode ter perdido.",
  "Loading past events...":
    "A carregar eventos anteriores...",
  "No past events":
    "Não existem eventos anteriores",
  "Past events will appear here automatically.":
    "Os eventos anteriores aparecerão aqui automaticamente.",
  "Past Event":
    "Evento anterior",
  "Thank you for your feedback":
    "Obrigado pelo seu feedback",
  "Give Feedback":
    "Dar feedback",
  "Thank you!":
    "Obrigado!",
  "Your feedback has been submitted.":
    "O seu feedback foi enviado.",
  "How was this event?":
    "Como foi este evento?",
  "Close feedback":
    "Fechar feedback",
  "star":
    "estrela",
  "stars":
    "estrelas",
  "Anything you'd like to tell us? (optional)":
    "Gostaria de nos dizer alguma coisa? (opcional)",
  "Submitting...":
    "A enviar...",
  "Submit Feedback":
    "Enviar feedback",
  "Please sign in to leave feedback.":
    "Inicie sessão para deixar feedback.",
  "Sorry, we couldn't submit your feedback.":
    "Desculpe, não foi possível enviar o seu feedback.",

  // Categories
  "Music": "Música",
  "Festival": "Festival",
  "Festivals": "Festivais",
  "Market": "Mercado",
  "Markets & Shopping": "Mercados e compras",
  "Food & Drink": "Comida e bebida",
  "Sport": "Desporto",
  "Family": "Família",
  "Arts & Culture": "Artes e cultura",
  "Nightlife": "Vida noturna",
  "Comedy": "Comédia",
  "Theatre": "Teatro",
  "Exhibitions": "Exposições",
  "Exhibition": "Exposição",
  "Workshop": "Workshop",
  "Workshops": "Workshops",
  "Charity": "Caridade",
  "Community": "Comunidade",
  "Retreat": "Retiro",
  "Retreats": "Retiros",
  "Wellbeing": "Bem-estar",
  "Outdoor": "Ao ar livre",

  // Profile
  "Manage your Lokly account and preferences.":
    "Gerir a sua conta e preferências do Lokly.",
  "Manage your Lokly account and location.":
    "Gerir a sua conta e localização do Lokly.",
  "Guest User":
    "Utilizador convidado",
  "Sign in to save your favourite events.":
    "Inicie sessão para guardar os seus eventos favoritos.",
  "Sign In":
    "Iniciar sessão",
  "Create Account":
    "Criar conta",
  "You're signed in":
    "Sessão iniciada",
  "Your favourite events can now be saved to your account.":
    "Agora pode guardar os seus eventos favoritos na sua conta.",
  "Sign Out":
    "Terminar sessão",
  "Preferences":
    "Preferências",
  "We ask so we can understand our Lokly community and provide useful insights to local venues. Your personal details are never shared.":
    "Perguntamos isto para compreender a nossa comunidade Lokly e fornecer informações úteis aos locais. Os seus dados pessoais nunca são partilhados.",
  "Manage event notifications":
    "Gerir notificações de eventos",
  "Location":
    "Localização",

  // Location
  "Back to Profile":
    "Voltar ao perfil",
  "Your Location":
    "A sua localização",
  "Choose the Algarve town you would like Lokly to use for nearby events.":
    "Escolha a localidade do Algarve que pretende que o Lokly utilize para os eventos perto de si.",
  "Where are you based?":
    "Onde está localizado?",
  "Save Location":
    "Guardar localização",
  "Location saved":
    "Localização guardada",
  "Algarve":
    "Algarve",

  // Lokly App
  "Lokly App":
    "App Lokly",
  "We’d love to have our own app one day.":
    "Adoraríamos ter a nossa própria app um dia.",
  "We’re a small, independent business and, for now, building a native app is beyond our reach.":
    "Somos uma pequena empresa independente e, por enquanto, criar uma app nativa está fora das nossas possibilidades.",
  "The good news? You can make Lokly feel just like an app on your phone.":
    "A boa notícia? Pode fazer com que o Lokly funcione como uma app no seu telemóvel.",
  "Add Lokly to your home screen and it’ll be there whenever you’re wondering what’s on. It’s free, takes less than a minute, and there’s nothing to download.":
    "Adicione o Lokly ao ecrã inicial e estará sempre disponível quando quiser saber o que está a acontecer. É gratuito, demora menos de um minuto e não precisa de descarregar nada.",
  "Want Lokly one tap away?":
    "Quer ter o Lokly à distância de um toque?",
  "Add Lokly to your phone's home screen and it'll be there whenever you're wondering what's on.":
    "Adicione o Lokly ao ecrã inicial do seu telemóvel e estará sempre disponível quando quiser saber o que está a acontecer.",
  "iPhone & iPad":
    "iPhone e iPad",
  "Open lokly.live in Safari.":
    "Abra o lokly.live no Safari.",
  "Tap the Share button.":
    "Toque no botão Partilhar.",
  "Tap Add to Home Screen.":
    "Toque em Adicionar ao ecrã inicial.",
  "Tap Add.":
    "Toque em Adicionar.",
  "Android":
    "Android",
  "Open lokly.live in Chrome.":
    "Abra o lokly.live no Chrome.",
  "Tap the ⋮ menu.":
    "Toque no menu ⋮.",
  "Tap Add to Home screen or Install app.":
    "Toque em Adicionar ao ecrã inicial ou Instalar app.",
  "Tap Add or Install.":
    "Toque em Adicionar ou Instalar.",
  "Help us make it happen":
    "Ajude-nos a tornar isso possível",
  "Share Lokly with your friends and help us grow. The more people who use Lokly, the closer we get to creating the app we’d love to have.":
    "Partilhe o Lokly com os seus amigos e ajude-nos a crescer. Quanto mais pessoas utilizarem o Lokly, mais perto estaremos de criar a app que gostaríamos de ter.",
  "Thanks for being part of Lokly.":
    "Obrigado por fazer parte do Lokly.",

  // Saved events
  "Your favourite events all in one place.":
    "Os seus eventos favoritos, todos num só lugar.",
  "Loading your saved events...":
    "A carregar os seus eventos guardados...",
  "No saved events yet":
    "Ainda não tem eventos guardados",
  "Tap the heart on an event to save it here.":
    "Toque no coração de um evento para o guardar aqui.",

  // Map
  "Loading map...":
    "A carregar o mapa...",
  "Event Map":
    "Mapa de eventos",
  "Discover events happening across the Algarve.":
    "Descubra os eventos que acontecem por todo o Algarve.",
  "Finding you...":
    "A encontrar...",
  "All Categories":
    "Todas as categorias",
  "All Areas":
    "Todas as áreas",
  "Events near you":
    "Eventos perto de si",

  // Tell a Friend
  "SPREAD THE WORD":
    "ESPALHE A PALAVRA",
  "Tell a friend about Lokly":
    "Fale do Lokly a um amigo",
  "Know someone who'd love to know what's happening in the Algarve? Send them Lokly and help them discover what's going on.":
    "Conhece alguém que gostaria de saber o que está a acontecer no Algarve? Envie-lhe o Lokly e ajude-o a descobrir o que se passa.",
  "Share Lokly":
    "Partilhe o Lokly",
  "Markets, music, festivals, food, family events and plenty more - there might be something your friends don't know about yet.":
    "Mercados, música, festivais, comida, eventos para toda a família e muito mais - pode haver algo que os seus amigos ainda não conhecem.",
  "Share on WhatsApp":
    "Partilhar no WhatsApp",
  "Share by Email":
    "Partilhar por email",
  "Copy Link":
    "Copiar link",
  "Lokly link copied!":
    "Link do Lokly copiado!",
  "Copying the link wasn't available on this device.":
    "Não foi possível copiar o link neste dispositivo.",
  "Have you found Lokly yet? It's a great way to discover what's happening in the Algarve: https://www.lokly.live":
    "Já descobriu o Lokly? É uma ótima forma de descobrir o que está a acontecer no Algarve: https://www.lokly.live",
  "Have you found Lokly?":
    "Já descobriu o Lokly?",
  "Because nobody wants to hear...":
    "Porque ninguém quer ouvir...",
  "\"Oh, you should have gone - it was brilliant.\"":
    "\"Oh, devia ter ido - foi fantástico.\"",

  // About Lokly
  "ABOUT LOKLY":
    "SOBRE O LOKLY",
  "So, what’s on?":
    "Então, o que há para fazer?",
  "There’s always something happening across the Algarve, the tricky part is finding out about it.":
    "Há sempre alguma coisa a acontecer por todo o Algarve. A parte difícil é saber o que se passa.",
  "“If only I’d known about that, I would have gone.”":
    "“Se eu soubesse disso, teria ido.”",
  "A moment many of us have had - and exactly the problem Lokly is here to solve.":
    "Um momento que muitos de nós já vivemos - e exatamente o problema que o Lokly está aqui para resolver.",
  "That’s exactly the problem Lokly is here to solve.":
    "É exatamente esse o problema que o Lokly está aqui para resolver.",
  "There are markets, live music, festivals, family days, exhibitions, sports and all sorts of local events happening across the Algarve, but finding out about them isn’t always easy.":
    "Há mercados, música ao vivo, festivais, dias para toda a família, exposições, desporto e todo o tipo de eventos locais a acontecer por todo o Algarve, mas nem sempre é fácil saber o que está a acontecer.",
  "Lokly brings them together in one simple place, so you can discover what’s happening, where and when - and stop missing out on things you would have loved to go to.":
    "O Lokly reúne tudo num só lugar, para que possa descobrir o que está a acontecer, onde e quando - e deixar de perder coisas a que teria adorado ir.",
  "Local businesses and organisers face the same challenge - getting the right information to the people who want to be there.":
    "Os negócios locais e os organizadores enfrentam o mesmo desafio - fazer chegar a informação certa às pessoas que querem estar presentes.",
  "Lokly brings the two together.":
    "O Lokly junta os dois lados.",
  "A simple place for people to discover more of the Algarve - and for the people creating those experiences to be discovered.":
    "Um lugar simples para as pessoas descobrirem mais do Algarve - e para quem cria essas experiências ser descoberto.",
  "For people":
    "Para as pessoas",
  "Discover more of the Algarve and find things to do without having to search in lots of different places.":
    "Descubra mais do Algarve e encontre coisas para fazer sem ter de procurar em muitos lugares diferentes.",
  "Find events near you":
    "Encontre eventos perto de si",
  "Explore different categories":
    "Explore diferentes categorias",
  "Save events you don't want to miss":
    "Guarde os eventos que não quer perder",
  "Discover new places and experiences":
    "Descubra novos lugares e experiências",
  "For local businesses & organisers":
    "Para negócios locais e organizadores",
  "Get your events in front of people who are looking for things to do in the Algarve.":
    "Mostre os seus eventos a pessoas que procuram coisas para fazer no Algarve.",
  "Reach people looking for local events":
    "Chegue a pessoas que procuram eventos locais",
  "Give your events more visibility":
    "Dê mais visibilidade aos seus eventos",
  "Help people discover your business":
    "Ajude as pessoas a descobrir o seu negócio",
  "Support the local community":
    "Apoie a comunidade local",
  "Ailsa, founder of Lokly":
    "Ailsa, fundadora do Lokly",
  "THE IDEA BEHIND LOKLY":
    "A IDEIA POR TRÁS DO LOKLY",
  "Built for the Algarve":
    "Criado para o Algarve",
  "Lokly was created with a simple aim - to make it easier for people to discover the events, activities and experiences that make the Algarve such a great place to live, visit and enjoy.":
    "O Lokly foi criado com um objetivo simples - tornar mais fácil descobrir os eventos, atividades e experiências que fazem do Algarve um lugar tão especial para viver, visitar e desfrutar.",
  "At the same time, Lokly aims to give local businesses and organisers another way to get their events noticed.":
    "Ao mesmo tempo, o Lokly pretende dar aos negócios locais e organizadores outra forma de dar a conhecer os seus eventos.",
  "Discover. Support. Enjoy the Algarve.":
    "Descubra. Apoie. Desfrute do Algarve.",

  // Add to Home Screen
  "A little Lokly tip":
    "Uma pequena dica do Lokly",
  "Want Lokly as an app?":
    "Quer ter o Lokly como uma app?",
  "Add Lokly to your home screen for quick, one-tap access to everything happening in the Algarve.":
    "Adicione o Lokly ao ecrã inicial para ter acesso rápido, com um só toque, a tudo o que está a acontecer no Algarve.",
  "Your Algarve, one tap away.":
    "O seu Algarve, à distância de um toque.",
  "Maybe later":
    "Talvez mais tarde",
  "Open the Menu and tap Lokly App for simple instructions.":
    "Abra o Menu e toque em Lokly App para obter instruções simples.",

  // General
  "No":
    "Não",
  "OK":
    "OK",
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
"use client";

import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { useLanguage } from "../LanguageContext";

export default function AboutPage() {
  const { language } = useLanguage();
  const pt = language === "pt";

  return (
    <main className="min-h-screen bg-slate-50 pb-40">
      <Header />

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-12">

        {/* INTRO */}
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#149EAF]">
            {pt ? "SOBRE O LOKLY" : "ABOUT LOKLY"}
          </p>

          <h1 className="mt-3 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
            {pt
              ? "Descubra mais do Algarve"
              : "Discover more of the Algarve"}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            {pt
              ? "O Lokly torna mais fácil descobrir o que está a acontecer no Algarve - desde mercados locais e música ao vivo a festivais, dias em família, exposições e eventos desportivos."
              : "Lokly makes it easier to discover what's happening around the Algarve - from local markets and live music to festivals, family days, exhibitions and sporting events."}
          </p>
        </div>

        {/* WHY LOKLY */}
        <div className="mt-12 rounded-3xl bg-white p-6 shadow-sm sm:p-10">
          <h2 className="text-2xl font-black text-slate-900">
            {pt ? "Porque existe o Lokly" : "Why Lokly exists"}
          </h2>

          <div className="mt-6 space-y-5 text-base leading-relaxed text-slate-600">
            <p className="font-semibold text-slate-800">
              {pt
                ? "Tudo começou com um problema simples."
                : "It started with a simple problem."}
            </p>

            <p>
              {pt
                ? "Há sempre alguma coisa a acontecer no Algarve. Descobrir o que está a acontecer, onde e quando nem sempre é fácil."
                : "There is always something happening in the Algarve. Finding out what's happening, where it is and when it's on isn't always easy."}
            </p>

            <p>
              {pt
                ? "A informação está espalhada pelo Facebook, websites, cartazes e pelo passa-palavra. As pessoas perdem eventos - e as empresas locais e organizadores podem ter dificuldade em fazer chegar os seus eventos às pessoas certas."
                : "Information is scattered across Facebook, websites, posters and word of mouth. People miss events - and local businesses and organisers can struggle to get their events in front of the right people."}
            </p>

            <p className="font-semibold text-slate-800">
              {pt
                ? "É esse o problema que o Lokly foi criado para resolver."
                : "That's the problem Lokly is designed to solve."}
            </p>

            <p>
              {pt
                ? "O Lokly reúne os eventos num único lugar simples, tornando mais fácil para as pessoas descobrirem o que acontece à sua volta e para as empresas e organizadores locais serem descobertos."
                : "Lokly brings events together in one simple place, making it easier for people to discover what's going on around them and easier for local businesses and organisers to be discovered."}
            </p>
          </div>
        </div>

        {/* TWO SIDES */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">

          {/* FOR PEOPLE */}
          <div className="rounded-3xl bg-[#e5f3f5] p-7 sm:p-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 64 64"
                stroke="#149EAF"
                strokeWidth="2.5"
              >
                <circle cx="20" cy="23" r="7" />
                <circle cx="32" cy="20" r="8" />
                <circle cx="44" cy="23" r="7" />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 48c0-7 5-12 12-12 5 0 9 3 11 7"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 48c0-8 5-14 11-14s11 6 11 14"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M33 43c2-4 6-7 11-7 7 0 12 5 12 12"
                />
              </svg>
            </div>

            <h2 className="mt-8 text-3xl font-black text-slate-900">
              {pt ? "Para pessoas" : "For people"}
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {pt
                ? "Descubra mais do Algarve e encontre coisas para fazer sem ter de procurar em vários lugares diferentes."
                : "Discover more of the Algarve and find things to do without having to search in lots of different places."}
            </p>

            <ul className="mt-8 space-y-4">

              <li className="flex items-center gap-4 text-base text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#149EAF] text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>

                {pt
                  ? "Encontre eventos perto de si"
                  : "Find events near you"}
              </li>

              <li className="flex items-center gap-4 text-base text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#149EAF] text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>

                {pt
                  ? "Explore diferentes categorias"
                  : "Explore different categories"}
              </li>

              <li className="flex items-center gap-4 text-base text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#149EAF] text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>

                {pt
                  ? "Guarde eventos que não quer perder"
                  : "Save events you don't want to miss"}
              </li>

              <li className="flex items-center gap-4 text-base text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#149EAF] text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>

                {pt
                  ? "Descubra novos lugares e experiências"
                  : "Discover new places and experiences"}
              </li>

            </ul>
          </div>

          {/* FOR BUSINESSES */}
          <div className="rounded-3xl bg-[#fff7eb] p-7 sm:p-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 64 64"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 27h44" />
                <path d="M13 27l3-13h32l3 13" />
                <path d="M13 27v25h38V27" />
                <path d="M13 27c0 5 4 8 8 8s8-3 8-8" />
                <path d="M29 27c0 5 4 8 8 8s8-3 8-8" />
                <path d="M45 27c0 5 3 8 6 8 1 0 2-.2 3-.7" />
                <path d="M25 52V39h14v13" />
                <path d="M18 20h28" />
              </svg>
            </div>

            <h2 className="mt-8 text-3xl font-black text-slate-900">
              {pt
                ? "Para empresas locais e organizadores"
                : "For local businesses & organisers"}
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {pt
                ? "Divulgue os seus eventos junto de pessoas que procuram coisas para fazer no Algarve."
                : "Get your events in front of people who are looking for things to do in the Algarve."}
            </p>

            <ul className="mt-8 space-y-4">

              <li className="flex items-center gap-4 text-base text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>

                {pt
                  ? "Chegue a pessoas que procuram eventos locais"
                  : "Reach people looking for local events"}
              </li>

              <li className="flex items-center gap-4 text-base text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>

                {pt
                  ? "Dê mais visibilidade aos seus eventos"
                  : "Give your events more visibility"}
              </li>

              <li className="flex items-center gap-4 text-base text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>

                {pt
                  ? "Ajude as pessoas a descobrir o seu negócio"
                  : "Help people discover your business"}
              </li>

              <li className="flex items-center gap-4 text-base text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>

                {pt
                  ? "Apoie a comunidade local"
                  : "Support the local community"}
              </li>

            </ul>
          </div>

        </div>

        {/* FOUNDER */}
        <div className="mt-12 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="grid items-center md:grid-cols-[280px_1fr]">

            <div className="h-72 md:h-full">
              <img
                src="/images/ailsa-lokly.jpg"
                alt={pt ? "Ailsa, fundadora do Lokly" : "Ailsa, founder of Lokly"}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-7 sm:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#149EAF]">
                {pt
                  ? "A IDEIA POR TRÁS DO LOKLY"
                  : "THE IDEA BEHIND LOKLY"}
              </p>

              <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
                {pt
                  ? "Criado para o Algarve"
                  : "Built for the Algarve"}
              </h2>

              <p className="mt-5 text-base leading-relaxed text-slate-600">
                {pt
                  ? "O Lokly foi criado com um objetivo simples - tornar mais fácil para as pessoas descobrirem os eventos, atividades e experiências que fazem do Algarve um lugar tão especial para viver, visitar e desfrutar."
                  : "Lokly was created with a simple aim - to make it easier for people to discover the events, activities and experiences that make the Algarve such a great place to live, visit and enjoy."}
              </p>

              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {pt
                  ? "Ao mesmo tempo, o Lokly pretende dar às empresas locais e aos organizadores outra forma de dar a conhecer os seus eventos."
                  : "At the same time, Lokly aims to give local businesses and organisers another way to get their events noticed."}
              </p>

              <p className="mt-6 text-lg font-bold text-slate-900">
                {pt
                  ? "Descubra. Apoie. Desfrute do Algarve."
                  : "Discover. Support. Enjoy the Algarve."}
              </p>
            </div>

          </div>
        </div>

      </section>

      <BottomNavigation />
    </main>
  );
}
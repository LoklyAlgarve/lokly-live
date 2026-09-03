"use client";

import { useState } from "react";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import { createClient } from "../../../utils/supabase/client";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Account created! Please check your email to confirm your account."
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-48">
      <Header />

      <section className="mx-auto max-w-lg px-5 pt-6 pb-8 sm:px-6 sm:pt-8 sm:pb-8">

        <h1 className="text-2xl font-black leading-tight text-slate-900 sm:text-4xl">
          Create your Lokly account
        </h1>

        <p className="mt-2 text-base text-slate-500 sm:text-lg">
          Create an account to save your favourite events.
        </p>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">

          <form onSubmit={handleSignUp} className="space-y-5">

            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                First name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-300 px-4 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
                placeholder="First name"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Last name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-300 px-4 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
                placeholder="Last name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-300 px-4 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-300 px-4 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
                placeholder="At least 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="min-h-14 w-full rounded-2xl bg-[#149EAF] px-5 font-bold text-white shadow-sm transition hover:bg-[#117F8E] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {message && (
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              {message}
            </div>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <a
              href="/profile"
              className="font-bold text-[#149EAF] hover:underline"
            >
              Sign in
            </a>
          </p>

        </div>

      </section>

      <BottomNavigation />
    </main>
  );
}
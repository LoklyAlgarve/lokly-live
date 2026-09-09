import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import LocationDisplay from "./LocationDisplay";
import ProfileContent from "./ProfileContent";
import { createClient } from "../../utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName = user?.user_metadata?.first_name || "";
  const lastName = user?.user_metadata?.last_name || "";

  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") ||
    "Guest User";

  const isSignedIn = !!user;

  async function handleSignOut() {
    "use server";

    const supabase = await createClient();

    await supabase.auth.signOut();

    redirect("/profile");
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-48">
      <Header />

      <ProfileContent
        fullName={fullName}
        isSignedIn={isSignedIn}
        email={user?.email}
        handleSignOut={handleSignOut}
      />

      <BottomNavigation />
    </main>
  );
}
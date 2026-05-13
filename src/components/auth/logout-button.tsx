import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function logout() {
  "use server";

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        className="rounded-md border border-oxford/15 bg-white px-3 py-2 text-sm font-semibold text-oxford transition hover:border-orange hover:text-orange"
        type="submit"
      >
        Выйти
      </button>
    </form>
  );
}

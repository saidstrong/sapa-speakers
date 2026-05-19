import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/app";
  }

  return value;
}

function redirectWithMessage(
  request: NextRequest,
  nextPath: string,
  type: "success" | "error",
  message: string
) {
  const redirectUrl = new URL(nextPath, request.nextUrl.origin);
  redirectUrl.searchParams.set("message", message);
  redirectUrl.searchParams.set("type", type);

  return NextResponse.redirect(redirectUrl);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const nextPath = getSafeNextPath(request.nextUrl.searchParams.get("next"));

  if (!code) {
    return redirectWithMessage(
      request,
      nextPath,
      "error",
      "Ссылка восстановления недействительна или устарела."
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirectWithMessage(
      request,
      nextPath,
      "error",
      "Не удалось подтвердить ссылку восстановления. Запросите новую ссылку."
    );
  }

  return redirectWithMessage(
    request,
    nextPath,
    "success",
    "Ссылка подтверждена. Задайте новый пароль."
  );
}

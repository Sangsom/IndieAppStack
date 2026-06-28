import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/lib/database.types";

type SupabaseCookie = ReturnType<NextResponse["cookies"]["getAll"]>[number];

function requirePublicEnv(
  name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY",
) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required public Supabase env var: ${name}`);
  }

  return value;
}

function copyCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie: SupabaseCookie) => {
    target.cookies.set(cookie);
  });

  return target;
}

function redirectWithCookies(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
  searchParams?: Record<string, string>,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return copyCookies(response, NextResponse.redirect(url));
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    requirePublicEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requirePublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const pathname = request.nextUrl.pathname;
  const isLoginRoute = pathname === "/admin/login";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (isLoginRoute) {
      return response;
    }

    return redirectWithCookies(request, response, "/admin/login", {
      next: `${pathname}${request.nextUrl.search}`,
    });
  }

  const { data: isAdmin } = await supabase.rpc("has_admin_role");

  if (!isAdmin) {
    if (isLoginRoute) {
      return response;
    }

    await supabase.auth.signOut();

    return redirectWithCookies(request, response, "/admin/login", {
      error: "access_denied",
    });
  }

  if (isLoginRoute) {
    return redirectWithCookies(request, response, "/admin");
  }

  return response;
}

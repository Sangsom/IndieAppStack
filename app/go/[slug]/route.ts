import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AffiliateRedirectRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  { params }: AffiliateRedirectRouteContext,
) {
  const { slug } = await params;

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return new Response("Affiliate link not found.", { status: 404 });
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data: link, error } = await supabase
    .from("affiliate_links")
    .select("destination_url,status")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !link || !["active", "pending"].includes(link.status)) {
    return new Response("Affiliate link not found.", { status: 404 });
  }

  return NextResponse.redirect(link.destination_url, 302);
}

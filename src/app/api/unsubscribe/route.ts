import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return new NextResponse("Ongeldige link", { status: 400 });
  }

  const supabase = getServiceClient();

  const { error } = await supabase
    .from("subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Unsubscribe error:", error);
    return new NextResponse("Er ging iets mis. Probeer het later.", { status: 500 });
  }

  // Redirect to a friendly page
  return NextResponse.redirect(new URL("/?unsubscribed=true", req.url));
}

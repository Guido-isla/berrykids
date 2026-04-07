import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { INTEREST_MAP, AREA_OPTIONS } from "@/lib/personalization";

const VALID_INTERESTS = Object.keys(INTEREST_MAP);
const VALID_AREAS = AREA_OPTIONS.map((a) => a.toLowerCase().replace(/\s+/g, "-"));

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, kids, area, consent } = body;

    // Validate email
    if (!email || typeof email !== "string" || !email.includes("@") || email.length < 5) {
      return NextResponse.json({ error: "Ongeldig e-mailadres" }, { status: 400 });
    }

    // Validate consent
    if (consent !== true) {
      return NextResponse.json({ error: "Toestemming is vereist" }, { status: 400 });
    }

    // Validate kids (optional — simple signup may not have them)
    const validKids = Array.isArray(kids)
      ? kids
          .filter((k: unknown): k is { age: number; interests: string[] } => {
            if (!k || typeof k !== "object") return false;
            const kid = k as Record<string, unknown>;
            return typeof kid.age === "number" && kid.age >= 0 && kid.age <= 18 && Array.isArray(kid.interests);
          })
          .map((k) => ({
            age: k.age,
            interests: k.interests.filter((i: string) => VALID_INTERESTS.includes(i)),
          }))
          .slice(0, 5)
      : [];

    // Validate area (optional)
    const validArea = typeof area === "string" && VALID_AREAS.includes(area.toLowerCase().replace(/\s+/g, "-"))
      ? area
      : "Haarlem centrum";

    const supabase = getServiceClient();

    const { error } = await supabase.from("subscribers").upsert(
      {
        email: email.toLowerCase().trim(),
        kids: validKids,
        area: validArea,
        consent_text: "Ik wil elke vrijdag Berry's weekendtips ontvangen",
        opted_in_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Er ging iets mis. Probeer het later." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Er ging iets mis" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getServiceClient } from "@/lib/supabase";
import { getSiteContext } from "@/lib/context";
import { activities } from "@/data/activities";
import { getDayPlanEvents } from "@/data/events-loader";
import { scoreEvent, scoreActivity } from "@/lib/berry-brain";
import { resolveEventImages } from "@/lib/photos";
import { fitsAge, matchesInterest } from "@/lib/personalization";
import WeeklyTips, { type TipItem } from "@/emails/WeeklyTips";
import { render } from "@react-email/components";

const resend = new Resend(process.env.RESEND_API_KEY);

// Protect endpoint with a secret — only Vercel Cron or manual calls with the key
const CRON_SECRET = process.env.CRON_SECRET || "berry-newsletter-2026";

type Subscriber = {
  id: string;
  email: string;
  area: string;
  kids: { age: number; interests: string[] }[];
};

export async function POST(req: NextRequest) {
  // Auth check
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getServiceClient();

    // Fetch all active subscribers
    const { data: subscribers, error: dbError } = await supabase
      .from("subscribers")
      .select("id, email, area, kids")
      .is("unsubscribed_at", null);

    if (dbError || !subscribers) {
      console.error("DB error:", dbError);
      return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
    }

    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers", sent: 0 });
    }

    // Get context for scoring
    const ctx = await getSiteContext();
    const events = getDayPlanEvents();
    const currentMonth = new Date().getMonth() + 1;
    const verified = activities.filter(
      (a) => a.verified && (!a.availableMonths || a.availableMonths.includes(currentMonth))
    );

    // Score all items once
    const scoredEvents = resolveEventImages(events)
      .filter((e) => e.image !== "/berry-icon.png")
      .map((e) => ({ item: e, score: scoreEvent(e, ctx), isEvent: true }));

    const scoredActivities = resolveEventImages(verified)
      .filter((a) => a.image !== "/berry-icon.png")
      .map((a) => ({ item: a, score: scoreActivity(a, ctx), isEvent: false }));

    const allScored = [...scoredEvents, ...scoredActivities].sort((a, b) => b.score - a.score);

    // Build vibe + weather line
    const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
    const dayName = dayNames[new Date().getDay()];
    const vibe = ctx.weather.isGoodWeather
      ? `zonnig weekend`
      : ctx.weather.isRainy
        ? `regenachtig weekend`
        : `fijn weekend`;
    const weatherLine = `${ctx.weather.current.icon} ${ctx.weather.current.temp}°C · ${ctx.weather.current.description}`;

    // Send personalized email to each subscriber
    let sent = 0;
    let errors = 0;

    for (const sub of subscribers as Subscriber[]) {
      try {
        // Personalize: re-rank for this subscriber's kids + interests
        const picks = getPersonalizedPicks(allScored, sub);

        if (picks.length === 0) continue;

        const html = await render(
          WeeklyTips({
            vibe,
            picks,
            weatherLine,
            unsubscribeUrl: `https://berrykids.nl/api/unsubscribe?id=${sub.id}`,
          })
        );

        await resend.emails.send({
          from: "Berry Kids <berry@berrykids.nl>",
          to: sub.email,
          subject: `🍓 Berry's top 5 dit weekend — ${vibe}`,
          html,
        });

        sent++;
      } catch (err) {
        console.error(`Failed to send to ${sub.email}:`, err);
        errors++;
      }
    }

    return NextResponse.json({ sent, errors, total: subscribers.length });
  } catch (err) {
    console.error("Newsletter send error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/** Personalize top 5 for a subscriber based on their kids' ages + interests */
function getPersonalizedPicks(
  allScored: { item: Record<string, unknown>; score: number; isEvent: boolean }[],
  sub: Subscriber
): TipItem[] {
  const hasProfile = sub.kids && sub.kids.length > 0;

  // Re-score with profile data
  const reScored = allScored.map((s) => {
    let boost = 0;
    if (hasProfile) {
      const youngest = Math.min(...sub.kids.map((k) => k.age));
      const ageMin = s.item.ageMin as number | undefined;
      const ageMax = s.item.ageMax as number | undefined;

      // Age fit
      if (fitsAge(ageMin, ageMax, youngest)) {
        boost += 5;
      } else if (sub.kids.some((k) => fitsAge(ageMin, ageMax, k.age))) {
        boost += 3;
      } else {
        boost -= 3;
      }

      // Interest match
      const allInterests = sub.kids.flatMap((k) => k.interests);
      const sub_cat = (s.item.subcategory as string) || (s.item.category as string) || "";
      if (allInterests.length > 0 && matchesInterest(sub_cat, allInterests)) {
        boost += 4;
      }
    }

    return { ...s, personalScore: s.score + boost };
  });

  // Sort by personalized score, deduplicate, take 5
  reScored.sort((a, b) => b.personalScore - a.personalScore);

  const seen = new Set<string>();
  const picks: TipItem[] = [];

  for (const s of reScored) {
    const title = s.item.title as string;
    if (seen.has(title)) continue;
    seen.add(title);

    picks.push({
      title,
      slug: s.item.slug as string,
      category: (s.item.subcategory as string) || (s.item.category as string),
      location: s.item.location as string,
      whyNow: (s.item.tip as string) || (s.item.description as string)?.slice(0, 80) || "",
      image: (s.item.resolvedImage as string) || (s.item.image as string),
      free: s.item.free as boolean,
      isEvent: s.isEvent,
    });

    if (picks.length >= 5) break;
  }

  return picks;
}

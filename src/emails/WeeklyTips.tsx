import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Img,
  Row,
  Column,
  Hr,
  Preview,
} from "@react-email/components";

export type TipItem = {
  title: string;
  slug: string;
  category: string;
  location: string;
  whyNow: string;
  image: string;
  free: boolean;
  isEvent: boolean;
};

type WeeklyTipsProps = {
  vibe: string;
  picks: TipItem[];
  weatherLine: string;
  unsubscribeUrl: string;
};

const baseUrl = "https://berrykids.nl";

export default function WeeklyTips({
  vibe = "zonnig weekend",
  picks = [],
  weatherLine = "☀️ 18°C dit weekend",
  unsubscribeUrl = "#",
}: WeeklyTipsProps) {
  return (
    <Html lang="nl">
      <Head />
      <Preview>🍓 Berry&apos;s top 5 voor dit weekend — {vibe}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={`${baseUrl}/berry-icon.png`}
              width="48"
              height="48"
              alt="Berry Kids"
              style={{ margin: "0 auto" }}
            />
            <Text style={brandName}>Berry Kids</Text>
          </Section>

          {/* Vibe + weather */}
          <Section style={vibeSection}>
            <Text style={vibeLabel}>{vibe}</Text>
            <Text style={headline}>Berry&apos;s top 5 dit weekend</Text>
            <Text style={weatherText}>{weatherLine}</Text>
          </Section>

          <Hr style={divider} />

          {/* Top 5 picks */}
          {picks.map((pick, i) => {
            const href = `${baseUrl}/${pick.isEvent ? "event" : "activiteiten"}/${pick.slug}`;
            return (
              <Section key={i} style={pickCard}>
                <Row>
                  <Column style={pickNumber}>
                    <Text style={{
                      ...numberBadge,
                      backgroundColor: NUMBER_COLORS[i] || "#F0ECE8",
                      color: NUMBER_TEXT[i] || "#6B6B6B",
                    }}>
                      {i + 1}
                    </Text>
                  </Column>
                  <Column style={pickContent}>
                    <Text style={pickCategory}>
                      {pick.category}{pick.free ? " · Gratis" : ""}
                    </Text>
                    <Link href={href} style={pickTitle}>
                      {pick.title}
                    </Link>
                    <Text style={pickWhy}>{pick.whyNow}</Text>
                    <Text style={pickMeta}>📍 {pick.location}</Text>
                    <Link href={href} style={pickCta}>
                      Bekijk →
                    </Link>
                  </Column>
                </Row>
                {i < picks.length - 1 && <Hr style={pickDivider} />}
              </Section>
            );
          })}

          <Hr style={divider} />

          {/* CTA */}
          <Section style={{ textAlign: "center" as const, padding: "20px 0" }}>
            <Link href={baseUrl} style={mainCta}>
              Alle activiteiten bekijken →
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Je ontvangt dit omdat je je hebt aangemeld voor Berry Kids weekendtips.
            </Text>
            <Link href={unsubscribeUrl} style={footerLink}>
              Afmelden
            </Link>
            <Text style={footerText}>
              Berry Kids · Haarlem · berrykids.nl
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const NUMBER_COLORS = ["#F4A09C", "#FFD8B0", "#C5B8E8", "#B8E0D4", "#F0ECE8"];
const NUMBER_TEXT = ["#FFFFFF", "#A67A40", "#5B4FA0", "#3D7A6A", "#6B6B6B"];

const body = {
  backgroundColor: "#FFF9F0",
  fontFamily: "'Nunito', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  margin: "0",
  padding: "0",
};

const container = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "20px",
};

const header = {
  textAlign: "center" as const,
  padding: "24px 0 8px",
};

const brandName = {
  fontSize: "18px",
  fontWeight: "800" as const,
  color: "#F4A09C",
  margin: "8px 0 0",
};

const vibeSection = {
  textAlign: "center" as const,
  padding: "16px 0",
};

const vibeLabel = {
  fontSize: "13px",
  fontWeight: "700" as const,
  color: "#F4A09C",
  margin: "0",
  textTransform: "lowercase" as const,
};

const headline = {
  fontSize: "26px",
  fontWeight: "900" as const,
  color: "#2D2D2D",
  margin: "4px 0 0",
  letterSpacing: "-0.5px",
};

const weatherText = {
  fontSize: "13px",
  fontWeight: "600" as const,
  color: "#6B6B6B",
  margin: "8px 0 0",
};

const divider = {
  borderTop: "1px solid #F0ECE8",
  margin: "8px 0",
};

const pickCard = {
  padding: "16px 0",
};

const pickNumber = {
  width: "36px",
  verticalAlign: "top" as const,
};

const numberBadge = {
  width: "28px",
  height: "28px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "900" as const,
  textAlign: "center" as const,
  lineHeight: "28px",
  margin: "0",
};

const pickContent = {
  paddingLeft: "12px",
  verticalAlign: "top" as const,
};

const pickCategory = {
  fontSize: "11px",
  fontWeight: "700" as const,
  color: "#F4A09C",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0",
};

const pickTitle = {
  fontSize: "18px",
  fontWeight: "800" as const,
  color: "#2D2D2D",
  textDecoration: "none",
  display: "block" as const,
  margin: "2px 0 0",
};

const pickWhy = {
  fontSize: "13px",
  fontWeight: "600" as const,
  color: "#6B6B6B",
  margin: "4px 0 0",
  lineHeight: "1.45",
};

const pickMeta = {
  fontSize: "12px",
  color: "#6B6B6B",
  margin: "6px 0 0",
};

const pickCta = {
  fontSize: "12px",
  fontWeight: "700" as const,
  color: "#F4A09C",
  textDecoration: "none",
  display: "inline-block" as const,
  marginTop: "6px",
};

const pickDivider = {
  borderTop: "1px solid #F5F0EB",
  margin: "0",
};

const mainCta = {
  display: "inline-block" as const,
  backgroundColor: "#F4A09C",
  color: "#FFFFFF",
  fontSize: "14px",
  fontWeight: "700" as const,
  textDecoration: "none",
  borderRadius: "999px",
  padding: "12px 28px",
};

const footer = {
  textAlign: "center" as const,
  padding: "24px 0",
};

const footerText = {
  fontSize: "11px",
  color: "#A09488",
  margin: "4px 0",
};

const footerLink = {
  fontSize: "11px",
  color: "#A09488",
  textDecoration: "underline",
};

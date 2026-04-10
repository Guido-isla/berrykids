import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import NewsTicker from "@/components/NewsTicker";
import Header from "@/components/Header";
import CookieNotice from "@/components/CookieNotice";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "nl" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <NewsTicker />
      <Header />
      {children}
      <CookieNotice />
    </NextIntlClientProvider>
  );
}

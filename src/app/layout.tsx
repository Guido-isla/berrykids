import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Berry Kids — De leukste uitjes met kinderen in Haarlem",
  description:
    "Ontdek de beste activiteiten, evenementen en tips voor gezinnen in de regio Haarlem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${nunito.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans">{children}</body>
    </html>
  );
}

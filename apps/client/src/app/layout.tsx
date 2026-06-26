import type { Metadata } from "next";
import { Gochi_Hand, Patrick_Hand, Geist_Mono } from "next/font/google";
import "./globals.css";

// Chalky handwriting for headings, brand & buttons — the chalkboard soul.
const gochiHand = Gochi_Hand({
  variable: "--font-chalk-display",
  subsets: ["latin"],
  weight: ["400"],
});

// Legible hand-printed face for body copy and UI labels.
const patrickHand = Patrick_Hand({
  variable: "--font-chalk-body",
  subsets: ["latin"],
  weight: ["400"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Exponent — Math Duel Arena",
  description: "Sharpen your brain in the arena! Fast, friendly mental-math duels for everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${gochiHand.variable} ${patrickHand.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

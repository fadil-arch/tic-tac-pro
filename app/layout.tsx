import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TicTac Pro",
    template: "%s | TicTac Pro",
  },
  description:
    "TicTac Pro is a modern Tic-Tac-Toe game built with Next.js, shadcn/ui, and Framer Motion.",
  keywords: [
    "Tic Tac Toe",
    "Next.js Game",
    "React Game",
    "Frontend Portfolio",
    "Framer Motion",
  ],
  authors: [{ name: "Fadil" }],
  openGraph: {
    title: "TicTac Pro",
    description:
      "A modern Tic-Tac-Toe game with animations and clean UI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TicTac Pro",
    description:
      "A modern Tic-Tac-Toe game built with Next.js and Framer Motion.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/Chatbot";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Rabita Amin | Software Engineer",
  description:
    "Portfolio of Rabita Amin, a dedicated Software Engineer specializing in backend, cloud, and AI solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen antialiased selection:bg-blue-500/30`}
        suppressHydrationWarning
      >
        {children}
        <Chatbot />
      </body>
    </html>
  );
}

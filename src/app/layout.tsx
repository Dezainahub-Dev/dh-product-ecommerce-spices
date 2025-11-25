import { Navbar } from "@/components/navigation/navbar";
import { AppProviders } from "@/app/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AvaNora Organics",
  description: "Premium organic spices, nuts, and seeds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-white text-zinc-900 antialiased`}>
        <AppProviders>
          <Navbar />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

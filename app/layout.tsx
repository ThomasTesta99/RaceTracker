import type { Metadata } from "next";
import { Inter, Rajdhani, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "TMT's RaceTracker",
  description: "TMTLU3's ultimate horse race tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", inter.variable, rajdhani.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-screen flex flex-col font-sans text-white">
        {children}
      </body>
    </html>
  );
}
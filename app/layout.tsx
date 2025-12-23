import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Unkahi | Anonymous Messaging Platform",
  description: "Receive anonymous messages from your Instagram followers without any signup.",
  openGraph: {
    title: "Unkahi | Anonymous Messaging",
    description: "Send me anonymous messages!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-[#0f172a]`}>
        {children}
      </body>
    </html>
  );
}

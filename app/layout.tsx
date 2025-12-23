import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased bg-[#f5f5f5]">
        {children}
      </body>
    </html>
  );
}

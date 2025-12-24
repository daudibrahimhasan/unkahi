import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto"
});

export const metadata: Metadata = {
  title: "unkahii | Anonymous Messaging Platform",
  description: "Receive anonymous messages from your Instagram followers without any signup.",
  openGraph: {
    title: "unkahii | Anonymous Messaging",
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
      <body className={`${roboto.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

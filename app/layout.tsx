import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIM Trucking Services - Performance Dashboard",
  description: "Performance dashboard for AIM Trucking Services, Inc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

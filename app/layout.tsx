import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BG Copy Checker",
  description: "Internal tool for British Gas employees to check copy against brand guidelines.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

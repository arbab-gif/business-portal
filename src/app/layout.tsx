import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Business Portal — Admin",
  description: "Admin management portal for training business accounts and students.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}

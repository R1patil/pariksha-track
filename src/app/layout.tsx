import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pariksha Track | ಪರೀಕ್ಷಾ ಟ್ರ್ಯಾಕ್",
  description: "Student English progress tracker for Karnataka Government School students",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kn">
      <body>{children}</body>
    </html>
  );
}

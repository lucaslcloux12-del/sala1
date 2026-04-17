import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Vault - Restricted Access",
  description: "Sistema de acesso restrito",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="antialiased overflow-hidden">
        <div className="scanline"></div>
        {children}
      </body>
    </html>
  );
}

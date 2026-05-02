import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import NavbarGate from "@/shared/components/Navbar/NavbarGate";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CONCH - Chat-Driven Website Builder",
  description:
    "CONCH lets teams build full websites through conversation with live AI-generated layouts, components, and page previews.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Providers>
          <NavbarGate />
          {children}
        </Providers>
      </body>
    </html>
  );
}

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeContainer from "../components/ui/ThemeContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeContainer />
        {children}
      </body>
    </html>
  );
}

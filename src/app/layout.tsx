import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/component/provider/SessionProvider";
import { ToastProvider } from "@/component/common/Toast";
import { ConfirmDialogProvider } from "@/component/common/ConfirmDialog";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Sand Symes Wellness AO Platform",
  description:
    "Experience guided breathwork rituals, meditations, wisdom drops, and daily check-ins with the Oracle AI. Your journey to healing and transformation starts here.",
  keywords:
    "breathwork, meditation, wellness, healing, oracle, astrology, spiritual guidance",
  authors: [{ name: "Sand Symes" }],
  openGraph: {
    title: "Sand Symes Wellness AO Platform",
    description:
      "Experience guided breathwork rituals, meditations, wisdom drops, and daily check-ins with the Oracle AI.",
    type: "website",
  },
  icons: {
    icon: "/logo.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ToastProvider>
            <ConfirmDialogProvider>
              <main className="min-h-screen">{children}</main>
            </ConfirmDialogProvider>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

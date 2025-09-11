"use client";

import Image from "next/image";
import Link from "next/link";
import { Alex_Brush, Noto_Serif_JP } from "next/font/google";

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: "400",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: "200",
});

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-primary-300/20 flex items-center justify-center group-hover:bg-primary-300/30 transition-colors">
              <Image
                src="/images/logo.png"
                alt="Sand Symes Logo"
                width={40}
                height={40}
                className="w-8 h-8"
              />
            </div>
            <h1
              className={`text-xl font-light text-primary-300 tracking-wide group-hover:text-primary-200 transition-colors ${notoSerifJP.className}`}
            >
              <span className={`${alexBrush.className} text-2xl`}>S</span>
              AND <span className={`${alexBrush.className} text-2xl`}>S</span>
              YMES
            </h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl">
          {/* Auth Card */}
          <div className="bg-black/60 backdrop-blur-xl border border-primary-300/20 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-300/10 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-primary-300/20 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-primary-300"></div>
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-primary-300 mb-2">
                {title}
              </h1>
              <p className="text-primary-300/70 text-sm leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Content */}
            {children}
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary-300/5 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-primary-300/3 blur-3xl"></div>
    </div>
  );
}

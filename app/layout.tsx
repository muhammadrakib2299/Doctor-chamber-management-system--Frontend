import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MedCore - Doctor Chamber Management",
  description: "Comprehensive management system for doctors and assistants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-slate-50`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

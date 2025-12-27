import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apache Parquet Tools - Viewer, Editor & Converter for Data Files",
  description:
    "Free online tools to convert Apache Parquet files to JSON, CSV, TSV, Excel, and SQL. 100% client-side processing - your data never leaves your browser.",
  keywords: [
    "parquet",
    "converter",
    "json",
    "csv",
    "excel",
    "sql",
    "online",
    "free",
  ],
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
        <Header />
        {children}
      </body>
    </html>
  );
}

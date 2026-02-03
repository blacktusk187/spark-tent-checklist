import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import AppShell from "@/components/AppShell";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Spark Tent Checklists",
  description: "Tent rental checklist system for Spark Event Rentals",
  icons: {
    icon: "/spark-logo-circular.png",
    apple: "/spark-logo-circular.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ToastProvider>
          <AppShell>{children}</AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}

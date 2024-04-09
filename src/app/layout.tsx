import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@styles/globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "A Rush Of Blood To The Head",
  description: "Modern Website(Protflio) with Next.js Created by Raymond Zhang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

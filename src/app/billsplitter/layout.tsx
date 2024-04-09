import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@styles/globals.css";
import { Providers } from "../providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bill Splitter",
  description: "split bills",
};

export default function BillSplitterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}><Providers>{children}</Providers></body>
    </html>
  );
}

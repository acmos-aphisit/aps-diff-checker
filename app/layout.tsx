import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diff — Code Comparison",
  description: "Compare two blocks of code side by side and see exactly what changed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

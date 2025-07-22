import type { Metadata } from "next";

import "./globals.css";



export const metadata: Metadata = {
  title: "Resume Anonymizer",
  description: "Upload multiple resumes and get anonymized versions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
